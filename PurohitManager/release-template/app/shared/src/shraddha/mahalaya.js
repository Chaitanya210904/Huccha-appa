/**
 * Mahalaya (Pitru Paksha) calculations and special days
 */

import { getSunriseSunset } from '../panchang/sunriseSunset.js';
import { getTithiAt } from '../panchang/tithi.js';
import { getNakshatraAt } from '../panchang/nakshatra.js';
import { getMasa, MASA_SYSTEMS } from '../panchang/masa.js';
import { AYANAMSA_SYSTEMS } from '../panchang/ayanamsa.js';
import { formatDate, addDays } from '../utils/dates.js';

/**
 * Calculates all Pitru Paksha (Mahalaya) dates for a given year
 * @param {number} year 
 * @param {object} place 
 * @param {object} [options={}] 
 * @returns {object}
 */
export function getMahalayaPaksha(year, place, options = {}) {
  const lat = place?.lat ?? 12.9716;
  const lon = place?.lon ?? 77.5946;
  const ayanamsa = options.ayanamsa || AYANAMSA_SYSTEMS.LAHIRI;

  // Pitru Paksha occurs in August/September/October (Bhadrapada Krishna Paksha in Amanta)
  // Scan starting from August 15 of that year
  const startScan = new Date(year, 7, 15);
  const days = [];
  let mahaBharaniDate = null;

  for (let i = 0; i < 70; i++) {
    const cur = addDays(startScan, i);
    const masa = getMasa(cur, MASA_SYSTEMS.AMANTA, ayanamsa);
    const cleanMasa = masa.name.replace('Adhika ', '');

    if (cleanMasa === 'Bhadrapada') {
      const sun = getSunriseSunset(cur, lat, lon);
      const aparahna = sun.panchaBhaga.aparahna;
      const tithi = getTithiAt(aparahna.start, ayanamsa);

      if (tithi.paksha === 'Krishna') {
        const nakshatra = getNakshatraAt(aparahna.start, ayanamsa);

        const dayEntry = {
          date: formatDate(cur),
          tithiIndex: tithi.index,
          tithiName: tithi.name,
          pakshaTithi: tithi.pakshaTithi,
          nakshatra: nakshatra.name,
          aparahnaStart: aparahna.start,
          aparahnaEnd: aparahna.end,
          isMahaBharani: nakshatra.name === 'Bharani',
          isAvidhavaNavami: tithi.pakshaTithi === 9,
          isYatiMahalaya: tithi.pakshaTithi === 12,
          isGhataChaturdashi: tithi.pakshaTithi === 14,
          isSarvaPitruAmavasya: tithi.pakshaTithi === 15 || tithi.index === 30
        };

        if (dayEntry.isMahaBharani && !mahaBharaniDate) {
          mahaBharaniDate = dayEntry.date;
        }

        days.push(dayEntry);

        if (dayEntry.isSarvaPitruAmavasya) {
          break; // Pitru Paksha ends at Amavasya
        }
      }
    }
  }

  // Deduplicate by date
  const uniqueDays = [];
  const seen = new Set();
  for (const d of days) {
    if (!seen.has(d.date)) {
      seen.add(d.date);
      uniqueDays.push(d);
    }
  }

  return {
    year,
    startDate: uniqueDays[0]?.date || null,
    endDate: uniqueDays[uniqueDays.length - 1]?.date || null,
    totalDays: uniqueDays.length,
    specialDays: {
      mahaBharani: uniqueDays.find(d => d.isMahaBharani)?.date || null,
      avidhavaNavami: uniqueDays.find(d => d.isAvidhavaNavami)?.date || null,
      yatiMahalaya: uniqueDays.find(d => d.isYatiMahalaya)?.date || null,
      ghataChaturdashi: uniqueDays.find(d => d.isGhataChaturdashi)?.date || null,
      sarvaPitruAmavasya: uniqueDays.find(d => d.isSarvaPitruAmavasya)?.date || null
    },
    days: uniqueDays
  };
}

/**
 * Finds the specific Mahalaya day for a deceased ancestor based on their tithi
 * @param {object} deceased 
 * @param {number} year 
 * @param {object} place 
 * @returns {object|null}
 */
export function getMahalayaDateForAncestor(deceased, year, place) {
  const paksha = getMahalayaPaksha(year, place);
  const targetPakshaTithi = deceased.pakshaTithi || (deceased.tithiIndex > 15 ? deceased.tithiIndex - 15 : deceased.tithiIndex);

  const matchedDay = paksha.days.find(d => d.pakshaTithi === targetPakshaTithi);
  return matchedDay || paksha.days[paksha.days.length - 1]; // Fallback to Sarva Pitru Amavasya
}

