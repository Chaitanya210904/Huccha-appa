/**
 * Karana calculation (half-tithi, 6 degrees elongation)
 */

import { getElongation } from './sunMoon.js';
import { AYANAMSA_SYSTEMS } from './ayanamsa.js';
import { findElongationCrossing } from './tithi.js';

export const KARANA_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti (Bhadra)",
  "Shakuni", "Chatushpada", "Naga", "Kimstughna"
];

const KARANA_SPAN = 6.0; // 6 degrees each

/**
 * Gets the Karana for a given date
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {{index: number, name: string, isVishti: boolean, isFixed: boolean}}
 */
export function getKaranaAt(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const elongation = getElongation(date, system);
  const halfTithi = Math.floor(elongation / KARANA_SPAN); // 0 to 59

  let name = "";
  let isFixed = false;

  if (halfTithi === 0) {
    name = "Kimstughna";
    isFixed = true;
  } else if (halfTithi >= 57) {
    if (halfTithi === 57) name = "Shakuni";
    else if (halfTithi === 58) name = "Chatushpada";
    else name = "Naga";
    isFixed = true;
  } else {
    // 1 to 56 are the 7 repeating karanas (Bava, Balava, Kaulava, Taitila, Garija, Vanija, Vishti)
    const repeatingIndex = (halfTithi - 1) % 7;
    name = KARANA_NAMES[repeatingIndex];
  }

  const isVishti = name.startsWith("Vishti");

  return {
    index: halfTithi + 1,
    name,
    isVishti,
    isFixed
  };
}

/**
 * Gets Karana with exact start and end times
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {object}
 */
export function getKaranaDetails(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const current = getKaranaAt(date, system);
  const startAngle = (current.index - 1) * KARANA_SPAN;
  const endAngle = (current.index % 60) * KARANA_SPAN;

  const startTime = findElongationCrossing(date, startAngle, system);
  const endTime = findElongationCrossing(new Date(date.getTime() + 6 * 3600 * 1000), endAngle, system);

  return {
    ...current,
    startTime,
    endTime
  };
}

