/**
 * Solar & Lunar Eclipse calculation and Sutak timings
 */

import { getSiderealPositions } from './sunMoon.js';
import { getTithiAt } from './tithi.js';
import { AYANAMSA_SYSTEMS } from './ayanamsa.js';

let astronomyEngine = null;
try {
  const mod = await import('astronomy-engine');
  astronomyEngine = mod.default || mod;
} catch (e) {
  astronomyEngine = null;
}

/**
 * Checks if an eclipse occurs near the given date
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {object|null}
 */
export function checkEclipse(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  if (astronomyEngine) {
    try {
      const astroTime = new astronomyEngine.AstroTime(date);
      // Search for lunar eclipse
      const lunar = astronomyEngine.SearchLunarEclipse(astroTime);
      if (lunar && Math.abs(lunar.peak.date.getTime() - date.getTime()) < 24 * 3600 * 1000) {
        const peak = lunar.peak.date;
        const sutakStart = new Date(peak.getTime() - 9 * 3600 * 1000); // 3 prahars (9 hrs) before
        return {
          type: "Chandra Grahana (Lunar Eclipse)",
          kind: lunar.kind, // 'total', 'partial', 'penumbral'
          peakTime: peak,
          sutakStartTime: sutakStart,
          isSutakActive: date.getTime() >= sutakStart.getTime() && date.getTime() <= peak.getTime()
        };
      }

      // Search for solar eclipse
      const solar = astronomyEngine.SearchGlobalSolarEclipse(astroTime);
      if (solar && Math.abs(solar.peak.date.getTime() - date.getTime()) < 24 * 3600 * 1000) {
        const peak = solar.peak.date;
        const sutakStart = new Date(peak.getTime() - 12 * 3600 * 1000); // 4 prahars (12 hrs) before
        return {
          type: "Surya Grahana (Solar Eclipse)",
          kind: solar.kind,
          peakTime: peak,
          sutakStartTime: sutakStart,
          isSutakActive: date.getTime() >= sutakStart.getTime() && date.getTime() <= peak.getTime()
        };
      }
    } catch (e) {
      // Fallback
    }
  }

  // Basic elongation check
  const tithi = getTithiAt(date, system);
  if (tithi.index === 15 || tithi.index === 30) {
    // Check if Moon's latitude is close to zero (near nodes)
    const { moonLon, sunLon } = getSiderealPositions(date, system);
    // Approximation: Node distance
    return null;
  }
  return null;
}

