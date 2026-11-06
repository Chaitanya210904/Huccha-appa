/**
 * Nakshatra and Pada calculations with exact start/end times
 */

import { getSiderealPositions } from './sunMoon.js';
import { AYANAMSA_SYSTEMS } from './ayanamsa.js';
import { normalize360 } from '../utils/dates.js';

export const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

export const NAKSHATRA_LORDS = [
  "Ketu", "Shukra", "Surya", "Chandra", "Mangala",
  "Rahu", "Guru", "Shani", "Budha"
];

const NAKSHATRA_SPAN = 360.0 / 27.0; // 13.333333333 degrees (13° 20')
const PADA_SPAN = NAKSHATRA_SPAN / 4.0; // 3.333333333 degrees (3° 20')

/**
 * Gets Nakshatra and Pada for a given date
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {{index: number, name: string, pada: number, lord: string, moonLon: number}}
 */
export function getNakshatraAt(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const { moonLon } = getSiderealPositions(date, system);
  const nakshatraIndex = Math.floor(moonLon / NAKSHATRA_SPAN) + 1; // 1 to 27
  const remainder = moonLon % NAKSHATRA_SPAN;
  const pada = Math.floor(remainder / PADA_SPAN) + 1; // 1 to 4
  const lord = NAKSHATRA_LORDS[(nakshatraIndex - 1) % 9];

  return {
    index: nakshatraIndex,
    name: NAKSHATRA_NAMES[nakshatraIndex - 1],
    pada,
    lord,
    moonLon
  };
}

/**
 * Finds crossing time for Moon longitude
 * @param {Date} approxDate 
 * @param {number} targetAngle 
 * @param {string} [system='Lahiri'] 
 * @returns {Date}
 */
export function findMoonCrossing(approxDate, targetAngle, system = AYANAMSA_SYSTEMS.LAHIRI) {
  let tMin = approxDate.getTime() - 24 * 3600 * 1000;
  let tMax = approxDate.getTime() + 24 * 3600 * 1000;

  function diff(tMs) {
    const { moonLon } = getSiderealPositions(new Date(tMs), system);
    let d = moonLon - targetAngle;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  let dMin = diff(tMin);
  let dMax = diff(tMax);
  if (dMin * dMax > 0) {
    tMin = approxDate.getTime() - 12 * 3600 * 1000;
    tMax = approxDate.getTime() + 12 * 3600 * 1000;
    dMin = diff(tMin);
    dMax = diff(tMax);
  }

  for (let iter = 0; iter < 40; iter++) {
    const tMid = (tMin + tMax) / 2;
    const dMid = diff(tMid);

    if (Math.abs(dMid) < 0.0001 || (tMax - tMin) < 1000) {
      return new Date(Math.round(tMid));
    }

    if (dMin * dMid <= 0) {
      tMax = tMid;
      dMax = dMid;
    } else {
      tMin = tMid;
      dMin = dMid;
    }
  }

  return new Date(Math.round((tMin + tMax) / 2));
}

/**
 * Gets Nakshatra with exact start and end times
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {object}
 */
export function getNakshatraDetails(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const current = getNakshatraAt(date, system);
  const startAngle = (current.index - 1) * NAKSHATRA_SPAN;
  const endAngle = (current.index % 27) * NAKSHATRA_SPAN;

  const startTime = findMoonCrossing(date, startAngle, system);
  const endTime = findMoonCrossing(new Date(date.getTime() + 12 * 3600 * 1000), endAngle, system);

  return {
    ...current,
    startTime,
    endTime
  };
}

