/**
 * Festival calculation engine evaluating rule-based festivals
 */

import { getSunriseSunset } from '../panchang/sunriseSunset.js';
import { getTithiAt } from '../panchang/tithi.js';
import { getNakshatraAt } from '../panchang/nakshatra.js';
import { getMasa, MASA_SYSTEMS } from '../panchang/masa.js';
import { getSolarRashiAt } from '../panchang/sankranti.js';
import { AYANAMSA_SYSTEMS } from '../panchang/ayanamsa.js';
import { getThooguPanchanga2026 } from '../panchang/thooguPanchanga2026.js';

let defaultFestivals = [];
try {
  // Try to load resources/festivals.json if in environment
  const fs = await import('fs');
  const path = await import('path');
  const file = path.resolve(process.cwd(), 'resources/festivals.json');
  if (fs.existsSync(file)) {
    defaultFestivals = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
} catch (e) {
  // Will be provided via parameter
}

/**
 * Checks which festivals fall on a given date and place
 * @param {Date|string} dateInput 
 * @param {object} place 
 * @param {Array} [festivalsList=null] Optional custom festival definitions
 * @param {object} [options={}] 
 * @returns {Array} List of matched festivals for the date
 */
export function getFestivalsForDate(dateInput, place, festivalsList = null, options = {}) {
  const date = new Date(dateInput);
  const lat = place?.lat ?? 12.9716;
  const lon = place?.lon ?? 77.5946;
  const ayanamsa = options.ayanamsa || AYANAMSA_SYSTEMS.LAHIRI;
  const masaSystem = options.masaSystem || MASA_SYSTEMS.AMANTA;

  const festivals = festivalsList || defaultFestivals || [];

  const sunData = getSunriseSunset(date, lat, lon);
  const { sunrise, sunset, noon, panchaBhaga } = sunData;

  const udayaTithi = getTithiAt(sunrise, ayanamsa);
  const madhyahnaTithi = getTithiAt(noon, ayanamsa);
  const aparahnaTithi = getTithiAt(panchaBhaga.aparahna.start, ayanamsa);
  const sayahnaTithi = getTithiAt(sunset, ayanamsa);
  
  // Pradosha: ~2 hours (approx 5 ghatis = 120 mins) after sunset
  const pradoshaTime = new Date(sunset.getTime() + 60 * 60 * 1000);
  const pradoshaTithi = getTithiAt(pradoshaTime, ayanamsa);

  // Nishita: Local midnight (approx sunset + 6 hours or opposite of noon)
  const nishitaTime = new Date(sunset.getTime() + (24 * 3600 * 1000 - sunData.dinamanaMs) / 2);
  const nishitaTithi = getTithiAt(nishitaTime, ayanamsa);

  const masa = getMasa(date, masaSystem, ayanamsa);
  const cleanMasa = masa.name.replace('Adhika ', '');
  const solarRashi = getSolarRashiAt(date, ayanamsa);
  const nakshatra = getNakshatraAt(sunrise, ayanamsa);

  const matches = [];

  // Check Authoritative 2026 Chaitanyashrama Thoogu Panchanga
  const thoogu = getThooguPanchanga2026(date);
  if (thoogu) {
    if (thoogu.festivals && thoogu.festivals.length > 0) {
      thoogu.festivals.forEach((fKn, idx) => {
        const fEn = thoogu.festivalsEn?.[idx] || fKn;
        matches.push({
          id: `thoogu_${thoogu.date}_${idx}`,
          name: fEn,
          kannada: fKn,
          category: 'Thoogu Panchanga'
        });
      });
    }
    if (thoogu.sankashtahara) {
      const isAng = thoogu.sankashtahara.isAngaraki;
      matches.push({
        id: `thoogu_sankashti_${thoogu.date}`,
        name: `${isAng ? 'Angaraki ' : ''}Sankashtahara Chaturthi (Moonrise: ${thoogu.sankashtahara.moonrise})`,
        kannada: `ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ (${isAng ? 'ಅಂಗಾರಕೀ' : 'ಸಾಮಾನ್ಯ'}) ಚಂ.ಉ: ${thoogu.sankashtahara.moonrise}`,
        category: 'Vrata'
      });
    }
    if (thoogu.ekadashi) {
      matches.push({
        id: `thoogu_ekadashi_${thoogu.date}`,
        name: `Sarvesham Ekadashi (${thoogu.ekadashi.englishName})`,
        kannada: `ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (${thoogu.ekadashi.name})`,
        category: 'Ekadashi'
      });
    }
    if (thoogu.hunnime) {
      matches.push({
        id: `thoogu_hunnime_${thoogu.date}`,
        name: thoogu.hunnime.englishName,
        kannada: thoogu.hunnime.name,
        category: 'Purnima'
      });
    }
    if (thoogu.amavasya) {
      matches.push({
        id: `thoogu_amavasya_${thoogu.date}`,
        name: thoogu.amavasya.englishName,
        kannada: thoogu.amavasya.name,
        category: 'Amavasya'
      });
    }
    if (thoogu.isGovtHoliday && thoogu.holidayName) {
      matches.push({
        id: `thoogu_holiday_${thoogu.date}`,
        name: `${thoogu.holidayNameEn || thoogu.holidayName} (Govt Holiday)`,
        kannada: `${thoogu.holidayName} (ಸರ್ಕಾರಿ ರಜೆ)`,
        category: 'Government Holiday'
      });
    }
  }

  for (const f of festivals) {
    // 1. Solar Ingress / Sankranti festivals
    if (f.rule === 'sun_ingress') {
      if (f.solarRashi && solarRashi.rashi.sanskrit === f.solarRashi) {
        // If Sun entered this Rashi today or is in 0-1 degree
        if (solarRashi.degreesInRashi < 1.2) {
          if (!matches.some(m => m.name === f.name || (f.kannada && m.kannada && (m.kannada.includes(f.kannada) || f.kannada.includes(m.kannada))))) {
          matches.push(f);
        }
        }
      }
      continue;
    }

    // 2. Masa check (if specified)
    if (f.masa && f.masa !== cleanMasa) {
      continue;
    }

    // 3. Paksha check
    if (f.paksha && f.paksha !== udayaTithi.paksha && f.paksha !== madhyahnaTithi.paksha && f.paksha !== nishitaTithi.paksha) {
      continue;
    }

    // 4. Tithi timing check
    if (f.tithi) {
      let tithiToCompare = udayaTithi;
      if (f.timing === 'madhyahna') tithiToCompare = madhyahnaTithi;
      else if (f.timing === 'aparahna') tithiToCompare = aparahnaTithi;
      else if (f.timing === 'sayahna' || f.timing === 'pradosha') tithiToCompare = pradoshaTithi;
      else if (f.timing === 'nishita') tithiToCompare = nishitaTithi;

      const targetTithi = f.paksha === 'Krishna' && f.tithi <= 15 ? f.tithi + 15 : f.tithi;
      if (tithiToCompare.index === targetTithi || (f.tithi === 30 && tithiToCompare.index === 30)) {
        // Nakshatra constraint if any
        if (f.nakshatra && nakshatra.name !== f.nakshatra) {
          continue;
        }
        if (!matches.some(m => m.name === f.name || (f.kannada && m.kannada && (m.kannada.includes(f.kannada) || f.kannada.includes(m.kannada))))) {
          matches.push(f);
        }
      }
    }
  }

  return matches;
}

