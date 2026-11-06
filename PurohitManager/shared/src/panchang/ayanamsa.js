/**
 * Ayanamsa calculations (Lahiri / Raman / KP)
 * Used to convert Tropical (Sayana) longitudes to Sidereal (Nirayana) longitudes.
 */

import { toJulianDate, normalize360 } from '../utils/dates.js';

export const AYANAMSA_SYSTEMS = {
  LAHIRI: 'Lahiri',   // Chitra Paksha (Standard Indian Calendar)
  RAMAN: 'Raman',     // B. V. Raman
  KP: 'KP',           // Krishnamurti Paddhati
};

/**
 * Calculates Lahiri Ayanamsa for a given Julian Date
 * Reference: Indian Astronomical Ephemeris / Spica at 180° sidereal
 * J2000.0 (JD 2451545.0) Lahiri = 23° 51' 25.53" = 23.857092°
 * @param {number} jd Julian Date
 * @returns {number} Ayanamsa in degrees
 */
export function getLahiriAyanamsa(jd) {
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0
  // Standard IAU precession model adjusted for Chitra Paksha zero year 285 CE
  const ayanamsa = 23.857092 + 1.396887 * T + 0.000308 * (T * T);
  return ayanamsa;
}

/**
 * Calculates Raman Ayanamsa (B. V. Raman)
 * Zero year ~ 397 CE
 * @param {number} jd Julian Date
 * @returns {number} Ayanamsa in degrees
 */
export function getRamanAyanamsa(jd) {
  // Raman ayanamsa uses zero epoch 397 AD with precession ~ 50.2888" / year
  const T = (jd - 2451545.0) / 36525.0;
  // Raman is typically about 1° 27' 00" lower than Lahiri in current era
  const lahiri = getLahiriAyanamsa(jd);
  return lahiri - 1.450;
}

/**
 * Calculates Krishnamurti Paddhati (KP) Ayanamsa
 * Zero year ~ 291 CE (approx 6 arcminutes less than Lahiri)
 * @param {number} jd Julian Date
 * @returns {number} Ayanamsa in degrees
 */
export function getKPAyanamsa(jd) {
  const lahiri = getLahiriAyanamsa(jd);
  // KP is exactly 0° 05' 56" (~0.09889 degrees) less than Lahiri
  return lahiri - 0.09889;
}

/**
 * Computes Ayanamsa for any date and system
 * @param {Date|number} dateOrJd Date object or Julian Date
 * @param {string} [system='Lahiri'] 'Lahiri' | 'Raman' | 'KP'
 * @returns {number} Ayanamsa in decimal degrees
 */
export function getAyanamsa(dateOrJd, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const jd = typeof dateOrJd === 'number' ? dateOrJd : toJulianDate(dateOrJd);
  
  switch (system) {
    case AYANAMSA_SYSTEMS.RAMAN:
      return getRamanAyanamsa(jd);
    case AYANAMSA_SYSTEMS.KP:
      return getKPAyanamsa(jd);
    case AYANAMSA_SYSTEMS.LAHIRI:
    default:
      return getLahiriAyanamsa(jd);
  }
}

/**
 * Formats decimal degrees to degrees, minutes, seconds string (e.g. 24° 12' 34")
 * @param {number} deg 
 * @returns {string}
 */
export function formatDMS(deg) {
  const d = Math.floor(deg);
  const mFull = (deg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}' ${String(s).padStart(2, '0')}"`;
}

/**
 * Converts Tropical (Sayana) longitude to Sidereal (Nirayana) longitude
 * @param {number} sayanaLon Tropical longitude [0, 360)
 * @param {Date|number} dateOrJd Date or Julian Day
 * @param {string} [system='Lahiri']
 * @returns {number} Nirayana longitude [0, 360)
 */
export function toNirayana(sayanaLon, dateOrJd, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const ayanamsa = getAyanamsa(dateOrJd, system);
  return normalize360(sayanaLon - ayanamsa);
}

