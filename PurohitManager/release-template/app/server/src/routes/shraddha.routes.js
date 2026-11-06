import { Router } from 'express';
import { remindersService } from '../services/reminders.service.js';
import { deceasedRepo } from '../repositories/deceased.repo.js';
import { settingsRepo } from '../repositories/settings.repo.js';
import { calculateAnnualShraddhaDate, getMahalayaPaksha, getMahalayaDateForAncestor } from '@purohit-manager/shared';

const router = Router();

// GET upcoming annual shraddhas
router.get('/upcoming', async (req, res, next) => {
  try {
    const days = Number(req.query.days) || 30;
    const upcoming = await remindersService.getUpcomingShraddhas(days);
    res.json({ success: true, data: upcoming });
  } catch (err) {
    next(err);
  }
});

// POST calculate annual shraddha date for a deceased ancestor in a specific year
router.post('/calculate-annual', async (req, res, next) => {
  try {
    const { deceasedId, targetYear } = req.body;
    const year = Number(targetYear) || new Date().getFullYear();

    let deceasedData = req.body.deceased;
    if (deceasedId && !deceasedData) {
      deceasedData = await deceasedRepo.getById(deceasedId);
    }

    if (!deceasedData) {
      return res.status(400).json({ success: false, error: "Deceased data or deceasedId required" });
    }

    const settings = await settingsRepo.get();
    const place = { lat: settings.latitude, lon: settings.longitude, name: settings.cityName };

    const result = calculateAnnualShraddhaDate(deceasedData, year, place, {
      sampradaya: deceasedData.sampradaya || settings.sampradaya,
      ayanamsa: settings.ayanamsa,
      masaSystem: settings.calendarSystem
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET Mahalaya (Pitru Paksha) calendar for a given year
router.get('/mahalaya', async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const settings = await settingsRepo.get();
    const place = { lat: settings.latitude, lon: settings.longitude, name: settings.cityName };

    const mahalaya = getMahalayaPaksha(year, place, { ayanamsa: settings.ayanamsa });
    res.json({ success: true, data: mahalaya });
  } catch (err) {
    next(err);
  }
});

// POST generate message text
router.post('/generate-message', async (req, res, next) => {
  try {
    const { type, params, lang } = req.body;
    const message = await remindersService.generateMessage(type || 'shraddhaReminder', params || {}, lang || 'kn');
    res.json({ success: true, data: { message } });
  } catch (err) {
    next(err);
  }
});

export default router;

