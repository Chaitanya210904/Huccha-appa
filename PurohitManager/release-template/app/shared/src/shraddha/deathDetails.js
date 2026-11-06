/**
 * Converts death date, time, and place into Vedic lunar coordinates (Masa, Paksha, Tithi)
 */

import { getTithiDetails, getUdayaTithi } from '../panchang/tithi.js';
import { getMasa, MASA_SYSTEMS } from '../panchang/masa.js';
import { getNakshatraAt } from '../panchang/nakshatra.js';
import { getSunriseSunset } from '../panchang/sunriseSunset.js';
import { getSolarRashiAt } from '../panchang/sankranti.js';
import { AYANAMSA_SYSTEMS } from '../panchang/ayanamsa.js';

/**
 * Calculates Vedic death details
 * @param {string} deathDate YYYY-MM-DD
 * @param {string} deathTime HH:mm (24 hour)
 * @param {object} place { lat: number, lon: number, name?: string }
 * @param {object} [options={}] { ayanamsa: 'Lahiri', masaSystem: 'Amanta' }
 * @returns {object}
 */
export function calculateDeathDetails(deathDate, deathTime, place, options = {}) {
  const [year, month, day] = deathDate.split('-').map(Number);
  const [hours, minutes] = (deathTime || '12:00').split(':').map(Number);
  
  const exactDeathInstant = new Date(year, month - 1, day, hours, minutes, 0);

  const lat = place?.lat ?? 12.9716;
  const lon = place?.lon ?? 77.5946;
  const ayanamsa = options.ayanamsa || AYANAMSA_SYSTEMS.LAHIRI;
  const masaSystem = options.masaSystem || MASA_SYSTEMS.AMANTA;

  // 1. Sun data for death day
  const sunData = getSunriseSunset(exactDeathInstant, lat, lon);
  const { sunrise, sunset, panchaBhaga } = sunData;

  // 2. Tithi at the exact moment of death
  const deathTithi = getTithiDetails(exactDeathInstant, ayanamsa);

  // 3. Udaya tithi (tithi at sunrise of the death day)
  const udayaTithi = getUdayaTithi(sunrise, ayanamsa);

  // 4. Lunar Masa and Adhika status
  const masa = getMasa(exactDeathInstant, masaSystem, ayanamsa);

  // 5. Nakshatra at death
  const nakshatra = getNakshatraAt(exactDeathInstant, ayanamsa);

  // 6. Solar Rashi at death
  const solarRashi = getSolarRashiAt(exactDeathInstant, ayanamsa);

  // Check if death happened during Aparahna (ideal Pitru Kala) or at Night
  const isAparahna = exactDeathInstant.getTime() >= panchaBhaga.aparahna.start.getTime() &&
                     exactDeathInstant.getTime() <= panchaBhaga.aparahna.end.getTime();
  const isNight = exactDeathInstant.getTime() < sunrise.getTime() || exactDeathInstant.getTime() > sunset.getTime();

  return {
    gregorianDate: deathDate,
    gregorianTime: deathTime,
    place: place?.name || 'Custom',
    exactDeathInstant,
    // Primary Vedic death attributes for annual Shraddha:
    masa: masa.name,
    isAdhikaMasa: masa.isAdhika,
    paksha: deathTithi.paksha,
    tithiIndex: deathTithi.index,
    tithiName: deathTithi.name,
    pakshaTithi: deathTithi.pakshaTithi,
    // Contextual information
    udayaTithiName: udayaTithi.name,
    isDeathTithiDifferentFromUdaya: deathTithi.index !== udayaTithi.index,
    nakshatra: nakshatra.name,
    nakshatraPada: nakshatra.pada,
    solarRashi: solarRashi.rashi.sanskrit,
    isAparahnaDeath: isAparahna,
    isNightDeath: isNight
  };
}

