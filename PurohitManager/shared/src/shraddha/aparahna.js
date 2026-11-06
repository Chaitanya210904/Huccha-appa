/**
 * Aparahna and Kutapa Kala calculations for Shraddha (Pitru Karma)
 * In Dharma Shastras:
 * - Daytime (Dinamana) is divided into 5 equal parts (Pancha-Bhaga):
 *   1. Pratah (1st part)
 *   2. Sangava (2nd part)
 *   3. Madhyahna (3rd part)
 *   4. Aparahna (4th part) -> Primary window for Shraddha!
 *   5. Sayahna (5th part)
 * - Kutapa Muhurta is the 8th Muhurta out of 15 (around 11:36 - 12:24 local time)
 * - Rohina Muhurta is the 9th Muhurta out of 15
 */

import { getSunriseSunset } from '../panchang/sunriseSunset.js';

/**
 * Calculates exact Aparahna and Kutapa windows for a given date and location
 * @param {Date|string} date 
 * @param {number} lat 
 * @param {number} lon 
 * @returns {object}
 */
export function getAparahnaWindow(date, lat, lon) {
  const sunData = getSunriseSunset(date, lat, lon);
  const { sunrise, sunset, panchaBhaga, kutapa, rohina } = sunData;

  const aparahna = panchaBhaga.aparahna;

  return {
    date: new Date(date).toISOString().split('T')[0],
    sunrise,
    sunset,
    aparahnaStart: aparahna.start,
    aparahnaEnd: aparahna.end,
    aparahnaDurationMinutes: Math.round((aparahna.end.getTime() - aparahna.start.getTime()) / 60000),
    kutapaStart: kutapa.start,
    kutapaEnd: kutapa.end,
    rohinaStart: rohina.start,
    rohinaEnd: rohina.end
  };
}

/**
 * Checks the overlap duration (in milliseconds) between a tithi window and the aparahna window
 * @param {Date} tithiStart 
 * @param {Date} tithiEnd 
 * @param {Date} aparahnaStart 
 * @param {Date} aparahnaEnd 
 * @returns {number} overlap in milliseconds (0 if no overlap)
 */
export function getAparahnaOverlap(tithiStart, tithiEnd, aparahnaStart, aparahnaEnd) {
  const overlapStart = Math.max(tithiStart.getTime(), aparahnaStart.getTime());
  const overlapEnd = Math.min(tithiEnd.getTime(), aparahnaEnd.getTime());

  if (overlapEnd > overlapStart) {
    return overlapEnd - overlapStart;
  }
  return 0;
}

