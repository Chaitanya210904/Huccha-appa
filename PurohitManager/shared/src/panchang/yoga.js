/**
 * 27 Yogas calculation: value + exact start/end times
 */

import { getSiderealPositions } from './sunMoon.js';
import { AYANAMSA_SYSTEMS } from './ayanamsa.js';
import { normalize360 } from '../utils/dates.js';

export const YOGA_NAMES = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti"
];

const YOGA_SPAN = 360.0 / 27.0; // 13° 20' = 13.3333333 degrees

function getYogaSum(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const { sunLon, moonLon } = getSiderealPositions(date, system);
  return normalize360(sunLon + moonLon);
}

/**
 * Gets the Yoga active at a given date
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {{index: number, name: string}}
 */
export function getYogaAt(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const sum = getYogaSum(date, system);
  const index = Math.floor(sum / YOGA_SPAN) + 1; // 1 to 27
  return {
    index,
    name: YOGA_NAMES[index - 1]
  };
}

/**
 * Finds exact time for yoga boundary crossing
 * @param {Date} approxDate 
 * @param {number} targetAngle 
 * @param {string} [system='Lahiri'] 
 * @returns {Date}
 */
export function findYogaCrossing(approxDate, targetAngle, system = AYANAMSA_SYSTEMS.LAHIRI) {
  let tMin = approxDate.getTime() - 24 * 3600 * 1000;
  let tMax = approxDate.getTime() + 24 * 3600 * 1000;

  function diff(tMs) {
    const sum = getYogaSum(new Date(tMs), system);
    let d = sum - targetAngle;
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
 * Gets Yoga details with start and end times
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {object}
 */
export function getYogaDetails(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const current = getYogaAt(date, system);
  const startAngle = (current.index - 1) * YOGA_SPAN;
  const endAngle = (current.index % 27) * YOGA_SPAN;

  const startTime = findYogaCrossing(date, startAngle, system);
  const endTime = findYogaCrossing(new Date(date.getTime() + 12 * 3600 * 1000), endAngle, system);

  return {
    ...current,
    startTime,
    endTime
  };
}

