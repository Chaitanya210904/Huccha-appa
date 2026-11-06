/**
 * Lunar Masa (Month) calculation: Amanta/Purnimanta, Adhika & Kshaya Masa detection
 */

import { getSiderealPositions } from './sunMoon.js';
import { getSolarRashiAt } from './sankranti.js';
import { getTithiAt, findElongationCrossing } from './tithi.js';
import { AYANAMSA_SYSTEMS } from './ayanamsa.js';

export const MASA_NAMES = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
];

export const MASA_SYSTEMS = {
  AMANTA: 'Amanta',       // South India (ends on Amavasya)
  PURNIMANTA: 'Purnimanta' // North India (ends on Purnima)
};

/**
 * Finds the Amavasya (New Moon) immediately preceding the date
 * @param {Date} date 
 * @param {string} system 
 * @returns {Date}
 */
export function findPrecedingAmavasya(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const current = getTithiAt(date, system);
  // How many tithis since Amavasya ended? current.index tithis (1 to 30)
  // Approximate time of preceding Amavasya end (elongation 0)
  const daysBack = (current.index) * 0.98;
  const approx = new Date(date.getTime() - daysBack * 24 * 3600 * 1000);
  return findElongationCrossing(approx, 0, system);
}

/**
 * Finds the Amavasya immediately succeeding the date
 * @param {Date} date 
 * @param {string} system 
 * @returns {Date}
 */
export function findSucceedingAmavasya(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const current = getTithiAt(date, system);
  const daysForward = (30 - current.index + 1) * 0.98;
  const approx = new Date(date.getTime() + daysForward * 24 * 3600 * 1000);
  return findElongationCrossing(approx, 0, system);
}

/**
 * Calculates Masa for a given date, checking for Adhika Masa
 * @param {Date} date 
 * @param {string} [masaSystem='Amanta'] 'Amanta' | 'Purnimanta'
 * @param {string} [ayanamsa='Lahiri'] 
 * @returns {{name: string, isAdhika: boolean, index: number, amantaName: string, purnimantaName: string}}
 */
export function getMasa(date, masaSystem = MASA_SYSTEMS.AMANTA, ayanamsa = AYANAMSA_SYSTEMS.LAHIRI) {
  // 1. Find the Amavasya boundaries enclosing this lunar cycle (Amanta month)
  const prevAmavasya = findPrecedingAmavasya(date, ayanamsa);
  const nextAmavasya = findSucceedingAmavasya(date, ayanamsa);

  // 2. Check Sun's sidereal Rashi at start and end of this Amanta month
  const rashiAtStart = getSolarRashiAt(prevAmavasya, ayanamsa);
  const rashiAtEnd = getSolarRashiAt(nextAmavasya, ayanamsa);

  // If Sun did not change Rashi between two Amavasyas -> Adhika Masa!
  const isAdhika = (rashiAtStart.index === rashiAtEnd.index);

  // The lunar month is named after the Rashi in which the Sun transits.
  // In normal month, Sun enters rashiAtEnd during the month.
  // Standard mapping: Sun in Mesha -> Vaishakha, Sun in Meena -> Chaitra
  // Formula: MasaIndex = (SunRashiAtTransit % 12) + 1
  let amantaIndex = rashiAtStart.index; // 1 (Mesha) -> Vaishakha, etc.
  if (rashiAtStart.index === 12) {
    amantaIndex = 1; // Sun in Meena -> Chaitra
  } else {
    amantaIndex = rashiAtStart.index + 1;
  }

  const amantaName = (isAdhika ? "Adhika " : "") + MASA_NAMES[amantaIndex - 1];

  // Purnimanta adjustments:
  // In Purnimanta, the Krishna Paksha precedes the Shukla Paksha and is named after the next month
  const tithiInfo = getTithiAt(date, ayanamsa);
  let purnimantaIndex = amantaIndex;
  if (tithiInfo.paksha === "Krishna") {
    purnimantaIndex = (amantaIndex % 12) + 1;
  }
  const purnimantaName = (isAdhika ? "Adhika " : "") + MASA_NAMES[purnimantaIndex - 1];

  const chosenName = (masaSystem === MASA_SYSTEMS.PURNIMANTA) ? purnimantaName : amantaName;
  const chosenIndex = (masaSystem === MASA_SYSTEMS.PURNIMANTA) ? purnimantaIndex : amantaIndex;

  return {
    name: chosenName,
    isAdhika,
    index: chosenIndex,
    amantaName,
    purnimantaName,
    masaSystem
  };
}

