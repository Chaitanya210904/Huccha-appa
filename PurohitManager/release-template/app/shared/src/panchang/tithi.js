/**
 * Vedic Tithi calculation: value + exact start/end via astronomical root finding
 */

import { getElongation } from './sunMoon.js';
import { normalize360 } from '../utils/dates.js';
import { AYANAMSA_SYSTEMS } from './ayanamsa.js';

export const TITHI_NAMES = [
  "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dvadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Prathama", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dvadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

/**
 * Gets the tithi number (1..30) and details at a specific instant
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {{index: number, name: string, paksha: string, pakshaTithi: number, elapsedPercent: number}}
 */
export function getTithiAt(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const elongation = getElongation(date, system);
  const tithiIndex = Math.floor(elongation / 12.0) + 1; // 1 to 30
  const paksha = tithiIndex <= 15 ? "Shukla" : "Krishna";
  const pakshaTithi = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;
  const elapsedInTithi = (elongation % 12.0) / 12.0;

  return {
    index: tithiIndex,
    name: TITHI_NAMES[tithiIndex - 1],
    paksha,
    pakshaTithi,
    elapsedPercent: Math.round(elapsedInTithi * 100 * 10) / 10
  };
}

/**
 * Finds the exact time when elongation reaches targetAngle (0..360)
 * Uses high-precision binary search / secant method
 * @param {Date} approxDate 
 * @param {number} targetAngle degrees [0, 360)
 * @param {string} [system='Lahiri']
 * @returns {Date}
 */
export function findElongationCrossing(approxDate, targetAngle, system = AYANAMSA_SYSTEMS.LAHIRI) {
  // Moon travels roughly 12 degrees relative to Sun every 24 hours (approx 0.5 degrees/hour)
  let tMin = approxDate.getTime() - 36 * 3600 * 1000;
  let tMax = approxDate.getTime() + 36 * 3600 * 1000;

  // We want elongation(t) - targetAngle to cross 0
  function diff(tMs) {
    const el = getElongation(new Date(tMs), system);
    let d = el - targetAngle;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  // Bracket the root
  let dMin = diff(tMin);
  let dMax = diff(tMax);

  // If both have same sign, narrow window around approxDate
  if (dMin * dMax > 0) {
    tMin = approxDate.getTime() - 14 * 3600 * 1000;
    tMax = approxDate.getTime() + 14 * 3600 * 1000;
    dMin = diff(tMin);
    dMax = diff(tMax);
  }

  // Binary search for root with tolerance of 1 second (1000 ms)
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
 * Gets current tithi details along with exact start and end times
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {{index: number, name: string, paksha: string, pakshaTithi: number, startTime: Date, endTime: Date}}
 */
export function getTithiDetails(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const current = getTithiAt(date, system);
  const startAngle = (current.index - 1) * 12.0;
  const endAngle = (current.index % 30) * 12.0;

  const startTime = findElongationCrossing(date, startAngle, system);
  const endTime = findElongationCrossing(new Date(date.getTime() + 12 * 3600 * 1000), endAngle, system);

  return {
    ...current,
    startTime,
    endTime
  };
}

/**
 * Determines Udaya Tithi (Tithi prevailing at Sunrise)
 * @param {Date} sunriseDate Sunrise timestamp
 * @param {string} [system='Lahiri']
 * @returns {object} Tithi details at sunrise
 */
export function getUdayaTithi(sunriseDate, system = AYANAMSA_SYSTEMS.LAHIRI) {
  return getTithiDetails(sunriseDate, system);
}

