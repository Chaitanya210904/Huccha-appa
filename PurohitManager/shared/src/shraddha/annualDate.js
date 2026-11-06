/**
 * Annual Pratyabdika Shraddha Date Selection Engine
 * Evaluates target masa/tithi, aparahna overlap, kshaya/vriddhi, and tradition differences.
 */

import { getSunriseSunset } from '../panchang/sunriseSunset.js';
import { getTithiAt, getTithiDetails, findElongationCrossing } from '../panchang/tithi.js';
import { getMasa, MASA_NAMES, MASA_SYSTEMS } from '../panchang/masa.js';
import { getAparahnaWindow, getAparahnaOverlap } from './aparahna.js';
import { resolveTraditionRule, SAMPRADAYAS } from './ruleSets.js';
import { AYANAMSA_SYSTEMS } from '../panchang/ayanamsa.js';
import { formatDate, addDays } from '../utils/dates.js';
import { getThooguPanchanga2026 } from '../panchang/thooguPanchanga2026.js';

/**
 * Calculates candidate dates for annual Shraddha in a given year
 * @param {object} deceased { masa: string, paksha: string, tithiIndex: number, sampradaya?: string }
 * @param {number} targetYear e.g. 2026
 * @param {object} place { lat: number, lon: number, name?: string }
 * @param {object} [options={}]
 * @returns {object} { recommendedDate: string, candidates: Array, explanation: string }
 */
export function calculateAnnualShraddhaDate(deceased, targetYear, place, options = {}) {
  const targetTithi = deceased.tithiIndex || (deceased.tithi ? deceased.tithi : 1);
  const targetMasa = deceased.masa?.replace('Adhika ', '') || 'Kartika';
  const sampradaya = options.sampradaya || deceased.sampradaya || SAMPRADAYAS.SMARTHA;
  const ayanamsa = options.ayanamsa || AYANAMSA_SYSTEMS.LAHIRI;
  const masaSystem = options.masaSystem || MASA_SYSTEMS.AMANTA;

  const lat = place?.lat ?? 12.9716;
  const lon = place?.lon ?? 77.5946;

  // Approximate search range for targetMasa in targetYear
  // Chaitra is approx March-April (month 2-3), Phalguna is Feb-March (month 1-2)
  const masaIndex = MASA_NAMES.indexOf(targetMasa); // 0 to 11
  const approxMonth = (masaIndex + 2) % 12; // approximate Gregorian month
  let startYear = targetYear;
  if (masaIndex >= 9 && approxMonth < 3) {
    // Pausha, Magha, Phalguna fall in Jan-March of targetYear + 1 or targetYear
  }

  // Scan 365 days of targetYear to locate the matching lunar month and tithi
  const startDate = new Date(targetYear, 0, 1);
  const candidateDays = [];

  for (let dayOffset = 0; dayOffset < 375; dayOffset++) {
    const curDate = addDays(startDate, dayOffset);
    if (curDate.getFullYear() > targetYear + 1) break;

    // Check if masa matches
    let cleanCurMasa;
    let thooguMatch = null;
    if (curDate.getFullYear() === 2026) {
      thooguMatch = getThooguPanchanga2026(curDate);
      if (thooguMatch) {
        cleanCurMasa = thooguMatch.masa.english.replace('Adhika ', '');
      }
    }
    if (!cleanCurMasa) {
      const curMasa = getMasa(curDate, masaSystem, ayanamsa);
      cleanCurMasa = curMasa.name.replace('Adhika ', '');
    }

    if (cleanCurMasa === targetMasa) {
      // Check if tithi matches targetTithi at any time during this day
      const sun = getSunriseSunset(curDate, lat, lon);
      const aparahna = sun.panchaBhaga.aparahna;
      const kutapa = sun.kutapa;

      // Check tithi at sunrise, noon, sunset (or thoogu udaya tithi)
      const tithiRise = getTithiAt(sun.sunrise, ayanamsa);
      const tithiSet = getTithiAt(sun.sunset, ayanamsa);
      const tithiAparahna = getTithiAt(aparahna.start, ayanamsa);

      const touchesDay = (thooguMatch && thooguMatch.tithi.index === targetTithi) ||
                          (tithiRise.index === targetTithi ||
                          tithiSet.index === targetTithi ||
                          tithiAparahna.index === targetTithi);

      if (touchesDay) {
        // Get exact tithi duration
        const details = getTithiDetails(aparahna.start, ayanamsa);
        // Overlap with Aparahna
        const overlapMs = getAparahnaOverlap(details.startTime, details.endTime, aparahna.start, aparahna.end);
        // Overlap with Kutapa
        const kutapaOverlapMs = getAparahnaOverlap(details.startTime, details.endTime, kutapa.start, kutapa.end);

        candidateDays.push({
          date: formatDate(curDate),
          sunrise: sun.sunrise,
          sunset: sun.sunset,
          aparahnaStart: aparahna.start,
          aparahnaEnd: aparahna.end,
          kutapaStart: kutapa.start,
          kutapaEnd: kutapa.end,
          tithiStart: details.startTime,
          tithiEnd: details.endTime,
          overlapMs,
          overlapMinutes: Math.round(overlapMs / 60000),
          kutapaOverlapMs,
          kutapaOverlapMinutes: Math.round(kutapaOverlapMs / 60000),
          isUdayaTithi: tithiRise.index === targetTithi
        });
      }
    }
  }

  // Deduplicate and filter candidates to adjacent days
  const uniqueCandidates = [];
  const seenDates = new Set();
  for (const c of candidateDays) {
    if (!seenDates.has(c.date)) {
      seenDates.add(c.date);
      uniqueCandidates.push(c);
    }
  }

  // Resolve tradition rule
  const decision = resolveTraditionRule(uniqueCandidates, sampradaya);
  const recommendedCandidate = uniqueCandidates[decision.recommendedIndex] || uniqueCandidates[0] || null;

  return {
    targetYear,
    deceasedMasa: targetMasa,
    deceasedTithi: targetTithi,
    sampradaya,
    recommendedDate: recommendedCandidate ? recommendedCandidate.date : null,
    recommendedDetails: recommendedCandidate,
    candidates: uniqueCandidates,
    explanation: decision.reason
  };
}

