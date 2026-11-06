import { Router } from 'express';
import { settingsRepo } from '../repositories/settings.repo.js';
import { getPanchang, generateSankalpa, getFestivalsForDate, formatDate, addDays } from '@purohit-manager/shared';
import fs from 'fs';
import path from 'path';
import { RESOURCES_DIR, DATA_DIR } from '../config/paths.js';

const router = Router();

// Load cities and festivals
let citiesList = [];
let festivalsList = [];
try {
  const citiesFile = path.resolve(RESOURCES_DIR, 'cities.json');
  if (fs.existsSync(citiesFile)) citiesList = JSON.parse(fs.readFileSync(citiesFile, 'utf8'));

  const festivalsFile = path.resolve(RESOURCES_DIR, 'festivals.json');
  if (fs.existsSync(festivalsFile)) festivalsList = JSON.parse(fs.readFileSync(festivalsFile, 'utf8'));
} catch (e) {}

// GET daily Panchang
router.get('/daily', async (req, res, next) => {
  try {
    const { date, lat, lon, ayanamsa, masaSystem } = req.query;
    const settings = await settingsRepo.get();

    const targetDate = date ? new Date(date) : new Date();
    const place = {
      lat: Number(lat) || settings.latitude,
      lon: Number(lon) || settings.longitude,
      name: settings.cityName
    };

    const panchang = getPanchang(targetDate, place, {
      ayanamsa: ayanamsa || settings.ayanamsa,
      masaSystem: masaSystem || settings.calendarSystem
    });

    // Check festivals for this day
    const festivals = getFestivalsForDate(targetDate, place, festivalsList, {
      ayanamsa: ayanamsa || settings.ayanamsa,
      masaSystem: masaSystem || settings.calendarSystem
    });

    res.json({
      success: true,
      data: {
        ...panchang,
        festivals
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET monthly Panchang summary for calendar grid
router.get('/month', async (req, res, next) => {
  try {
    const { year, month } = req.query; // month is 1 to 12
    const settings = await settingsRepo.get();
    const place = { lat: settings.latitude, lon: settings.longitude, name: settings.cityName };

    const y = Number(year) || new Date().getFullYear();
    const m = Number(month) || (new Date().getMonth() + 1);

    const daysInMonth = new Date(y, m, 0).getDate();
    const days = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const curDate = new Date(y, m - 1, d);
      const panchang = getPanchang(curDate, place, {
        ayanamsa: settings.ayanamsa,
        masaSystem: settings.calendarSystem
      });

      const festivals = getFestivalsForDate(curDate, place, festivalsList, {
        ayanamsa: settings.ayanamsa,
        masaSystem: settings.calendarSystem
      });

      days.push({
        date: formatDate(curDate),
        dayOfMonth: d,
        vara: panchang.angas.vara.devanagari,
        varaKannada: panchang.angas.vara.kannada || panchang.angas.vara.devanagari,
        varaEnglish: panchang.angas.vara.name,
        tithi: panchang.angas.udayaTithi.name,
        tithiKannada: panchang.angas.udayaTithi.kannada || panchang.angas.udayaTithi.name,
        tithiFullKannada: panchang.angas.udayaTithi.fullKannada || `${panchang.angas.udayaTithi.paksha} ${panchang.angas.udayaTithi.name}`,
        paksha: panchang.angas.udayaTithi.paksha,
        pakshaKannada: panchang.angas.udayaTithi.pakshaKannada || (panchang.angas.udayaTithi.paksha === 'Shukla' ? 'ಶುಕ್ಲ' : 'ಕೃಷ್ಣ'),
        nakshatra: panchang.angas.nakshatra.name,
        nakshatraKannada: panchang.angas.nakshatra.kannada || panchang.angas.nakshatra.name,
        masa: panchang.calendar.masa.name,
        masaKannada: panchang.calendar.masa.kannada || panchang.calendar.masa.name,
        samvatsara: panchang.calendar.samvatsara.name,
        samvatsaraKannada: panchang.calendar.samvatsara.kannada || panchang.calendar.samvatsara.name,
        festivals: festivals.map(f => f.kannada || f.name),
        festivalsEn: festivals.map(f => f.name),
        sankashtahara: panchang.calendar.sankashtahara || null,
        ekadashi: panchang.calendar.ekadashi || null,
        hunnime: panchang.calendar.hunnime || null,
        amavasya: panchang.calendar.amavasya || null,
        isGovtHoliday: panchang.calendar.isGovtHoliday || false,
        holidayName: panchang.calendar.holidayName || null,
        sunrise: panchang.sunData.sunrise,
        sunset: panchang.sunData.sunset
      });
    }

    res.json({
      success: true,
      data: {
        year: y,
        month: m,
        samvatsara: days[0]?.samvatsara,
        samvatsaraKannada: days[0]?.samvatsaraKannada,
        masa: days[0]?.masa,
        masaKannada: days[0]?.masaKannada,
        source: y === 2026 ? "ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ೨೦೨೬ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)" : "Astronomical Model",
        days
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST generate Sankalpa text
router.post('/sankalpa', async (req, res, next) => {
  try {
    const { date, client, serviceType, ancestorName, customPurpose } = req.body;
    const settings = await settingsRepo.get();
    const place = {
      lat: settings.latitude,
      lon: settings.longitude,
      name: settings.cityName,
      riverContext: citiesList.find(c => c.id === settings.cityId)?.riverContext || 'पुण्यदेशे'
    };

    const result = generateSankalpa({
      date: date ? new Date(date) : new Date(),
      place,
      client,
      serviceType: serviceType || 'satyanarayana',
      ancestorName,
      customPurpose
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET offline cities list
router.get('/cities', (req, res) => {
  res.json({ success: true, data: citiesList });
});

// GET festivals list
router.get('/festivals', (req, res) => {
  res.json({ success: true, data: festivalsList });
});

// GET uploaded calendars list
router.get('/uploaded-calendars', (req, res) => {
  try {
    const file = path.resolve(DATA_DIR, 'uploadedCalendars.json');
    let list = [];
    if (fs.existsSync(file)) {
      list = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST upload calendar PDF
router.post('/upload-calendar', (req, res) => {
  try {
    const { year, filename, fileBase64, title, notes } = req.body;
    if (!year) {
      return res.status(400).json({ success: false, error: 'Year is required' });
    }
    if (!fileBase64) {
      return res.status(400).json({ success: false, error: 'File data is required' });
    }

    const calendarsDir = path.resolve(DATA_DIR, 'calendars');
    if (!fs.existsSync(calendarsDir)) {
      fs.mkdirSync(calendarsDir, { recursive: true });
    }

    const cleanFilename = filename || `Calendar_${year}.pdf`;
    const targetFile = path.resolve(calendarsDir, `Calendar_${year}.pdf`);

    // Extract base64 buffer
    const base64Data = fileBase64.replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(targetFile, buffer);

    const sizeMB = (buffer.length / (1024 * 1024)).toFixed(1);
    const sizeFormatted = `${sizeMB} MB`;

    // Save record to uploadedCalendars.json
    const recordsFile = path.resolve(DATA_DIR, 'uploadedCalendars.json');
    let list = [];
    if (fs.existsSync(recordsFile)) {
      list = JSON.parse(fs.readFileSync(recordsFile, 'utf8'));
    }

    const newRecord = {
      id: `cal_${year}`,
      year: Number(year),
      title: title || `ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ${year}`,
      titleEn: `Calendar ${year}`,
      filename: cleanFilename,
      savedPath: targetFile,
      sizeFormatted,
      uploadedAt: new Date().toISOString(),
      status: 'Uploaded & Ready for Analysis',
      notes: notes || `Panchanga PDF uploaded for year ${year}`
    };

    const existingIdx = list.findIndex(c => c.year === Number(year));
    if (existingIdx !== -1) {
      list[existingIdx] = newRecord;
    } else {
      list.push(newRecord);
    }

    fs.writeFileSync(recordsFile, JSON.stringify(list, null, 2), 'utf8');

    res.json({
      success: true,
      data: newRecord,
      message: `Calendar PDF for year ${year} uploaded successfully!`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

