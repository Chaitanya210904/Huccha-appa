/**
 * Sun & Moon positions and wrapper over astronomy-engine with built-in Meeus fallback
 */

import { toJulianDate, normalize360 } from '../utils/dates.js';
import { toNirayana, AYANAMSA_SYSTEMS } from './ayanamsa.js';

let astronomyEngine = null;
try {
  // Dynamically import or require astronomy-engine if installed
  const mod = await import('astronomy-engine');
  astronomyEngine = mod.default || mod;
} catch (e) {
  // Graceful fallback to pure astronomical algorithms
  astronomyEngine = null;
}

const RAD = Math.PI / 180.0;
const DEG = 180.0 / Math.PI;

/**
 * Pure mathematical high-precision calculation of Solar Sayana (Tropical) Ecliptic Longitude
 * Based on Jean Meeus Astronomical Algorithms
 * @param {number} jd Julian Date
 * @returns {number} Sun apparent tropical longitude in degrees [0, 360)
 */
function calculateSunTropicalMeeus(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  // Geometric mean longitude of the Sun
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  // Mean anomaly of the Sun
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = M * RAD;

  // Sun equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);

  // True longitude
  const trueLon = L0 + C;

  // Apparent longitude (corrected for aberration and nutation)
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLon - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  return normalize360(lambda);
}

/**
 * Pure mathematical calculation of Lunar Sayana (Tropical) Ecliptic Longitude
 * Based on Jean Meeus chapter 47 truncated series
 * @param {number} jd Julian Date
 * @returns {number} Moon apparent tropical longitude in degrees [0, 360)
 */
function calculateMoonTropicalMeeus(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const T2 = T * T;
  const T3 = T * T * T;

  // Moon mean longitude
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841.0;
  // Mean elongation of Moon
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868.0;
  // Sun mean anomaly
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2;
  // Moon mean anomaly
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699.0;
  // Moon argument of latitude
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000.0;

  // Major periodic terms (in millionths of a degree)
  let dL = 6288774 * Math.sin(Mp * RAD) +
           1274027 * Math.sin((2 * D - Mp) * RAD) +
           658314 * Math.sin(2 * D * RAD) +
           213618 * Math.sin(2 * Mp * RAD) -
           185116 * Math.sin(M * RAD) -
           114332 * Math.sin(2 * F * RAD) +
           58793 * Math.sin((2 * D - 2 * Mp) * RAD) +
           57066 * Math.sin((2 * D - M - Mp) * RAD) +
           53322 * Math.sin((2 * D + Mp) * RAD) +
           45758 * Math.sin((2 * D - M) * RAD) -
           40923 * Math.sin((M - Mp) * RAD) -
           34720 * Math.sin(D * RAD) -
           30383 * Math.sin((M + Mp) * RAD) +
           15327 * Math.sin((2 * D - 2 * F) * RAD) -
           12528 * Math.sin((Mp + 2 * F) * RAD) +
           10980 * Math.sin((Mp - 2 * F) * RAD);

  const lambda = Lp + dL / 1000000.0;
  return normalize360(lambda);
}

/**
 * Gets apparent Tropical (Sayana) positions of Sun and Moon
 * @param {Date} date 
 * @returns {{sunLon: number, moonLon: number}}
 */
export function getTropicalPositions(date) {
  if (astronomyEngine) {
    try {
      const time = new astronomyEngine.AstroTime(date);
      // Geocentric apparent ecliptic coordinates
      const sunVec = astronomyEngine.GeoVector('Sun', time, true);
      const sunEcl = astronomyEngine.Ecliptic(sunVec);

      const moonVec = astronomyEngine.GeoVector('Moon', time, true);
      const moonEcl = astronomyEngine.Ecliptic(moonVec);

      return {
        sunLon: normalize360(sunEcl.elon),
        moonLon: normalize360(moonEcl.elon),
        sunLat: sunEcl.elat,
        moonLat: moonEcl.elat
      };
    } catch (err) {
      // Fallback
    }
  }

  const jd = toJulianDate(date);
  return {
    sunLon: calculateSunTropicalMeeus(jd),
    moonLon: calculateMoonTropicalMeeus(jd),
    sunLat: 0,
    moonLat: 0
  };
}

/**
 * Gets Nirayana (Sidereal) positions of Sun and Moon for Vedic Panchang calculations
 * @param {Date} date 
 * @param {string} [system='Lahiri']
 * @returns {{sunLon: number, moonLon: number, elongation: number, jd: number}}
 */
export function getSiderealPositions(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const jd = toJulianDate(date);
  const tropical = getTropicalPositions(date);
  const sunSidereal = toNirayana(tropical.sunLon, jd, system);
  const moonSidereal = toNirayana(tropical.moonLon, jd, system);

  // Elongation: difference between Moon and Sun (0 to 360)
  const elongation = normalize360(moonSidereal - sunSidereal);

  return {
    sunLon: sunSidereal,
    moonLon: moonSidereal,
    elongation,
    jd
  };
}

/**
 * Computes elongation at any given Date
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {number} Elongation in [0, 360)
 */
export function getElongation(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  return getSiderealPositions(date, system).elongation;
}

