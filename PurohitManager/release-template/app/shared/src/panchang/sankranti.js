/**
 * Sankranti (Sun transit into 12 Rashis) and Punya Kala calculations
 */

import { getSiderealPositions } from './sunMoon.js';
import { AYANAMSA_SYSTEMS } from './ayanamsa.js';
import { normalize360 } from '../utils/dates.js';

export const RASHI_NAMES = [
  { index: 1, sanskrit: "Mesha", english: "Aries", hindi: "मेष", kannada: "ಮೇಷ", degrees: 0 },
  { index: 2, sanskrit: "Vrishabha", english: "Taurus", hindi: "वृषभ", kannada: "ವೃಷಭ", degrees: 30 },
  { index: 3, sanskrit: "Mithuna", english: "Gemini", hindi: "मिथुन", kannada: "ಮಿಥುನ", degrees: 60 },
  { index: 4, sanskrit: "Karka", english: "Cancer", hindi: "कर्क", kannada: "ಕರ್ಕಾಟಕ", degrees: 90 },
  { index: 5, sanskrit: "Simha", english: "Leo", hindi: "सिंह", kannada: "ಸಿಂಹ", degrees: 120 },
  { index: 6, sanskrit: "Kanya", english: "Virgo", hindi: "कन्या", kannada: "ಕನ್ಯಾ", degrees: 150 },
  { index: 7, sanskrit: "Tula", english: "Libra", hindi: "तुला", kannada: "ತುಲಾ", degrees: 180 },
  { index: 8, sanskrit: "Vrishchika", english: "Scorpio", hindi: "वृश्चिक", kannada: "ವೃಶ್ಚಿಕ", degrees: 210 },
  { index: 9, sanskrit: "Dhanu", english: "Sagittarius", hindi: "धनु", kannada: "ಧನುಸ್ಸು", degrees: 240 },
  { index: 10, sanskrit: "Makara", english: "Capricorn", hindi: "मकर", kannada: "ಮಕರ", degrees: 270 },
  { index: 11, sanskrit: "Kumbha", english: "Aquarius", hindi: "कुम्भ", kannada: "ಕುಂಭ", degrees: 300 },
  { index: 12, sanskrit: "Meena", english: "Pisces", hindi: "मीन", kannada: "ಮೀನ", degrees: 330 }
];

/**
 * Gets Sun's current Rashi and degree within Rashi
 * @param {Date} date 
 * @param {string} [system='Lahiri'] 
 * @returns {object}
 */
export function getSolarRashiAt(date, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const { sunLon } = getSiderealPositions(date, system);
  const rashiIndex = Math.floor(sunLon / 30.0) + 1; // 1 to 12
  const degreesInRashi = sunLon % 30.0;

  return {
    index: rashiIndex,
    rashi: RASHI_NAMES[rashiIndex - 1],
    sunLon,
    degreesInRashi
  };
}

/**
 * Finds exact time of Sun ingress into target Rashi
 * @param {Date} approxDate 
 * @param {number} rashiIndex 1 to 12
 * @param {string} [system='Lahiri'] 
 * @returns {Date}
 */
export function findSankrantiMoment(approxDate, rashiIndex, system = AYANAMSA_SYSTEMS.LAHIRI) {
  const targetLon = ((rashiIndex - 1) * 30.0) % 360;

  let tMin = approxDate.getTime() - 20 * 24 * 3600 * 1000;
  let tMax = approxDate.getTime() + 20 * 24 * 3600 * 1000;

  function diff(tMs) {
    const { sunLon } = getSiderealPositions(new Date(tMs), system);
    let d = sunLon - targetLon;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  }

  for (let iter = 0; iter < 45; iter++) {
    const tMid = (tMin + tMax) / 2;
    const dMid = diff(tMid);

    if (Math.abs(dMid) < 0.00001 || (tMax - tMin) < 1000) {
      return new Date(Math.round(tMid));
    }

    const dMin = diff(tMin);
    if (dMin * dMid <= 0) {
      tMax = tMid;
    } else {
      tMin = tMid;
    }
  }

  return new Date(Math.round((tMin + tMax) / 2));
}

/**
 * Gets Punya Kala details for a Sankranti
 * 16 Ghatis = 16 * 24m = 384 minutes = 6 hours 24 mins
 * @param {Date} transitTime 
 * @param {string} rashiName 
 * @returns {object}
 */
export function getPunyaKala(transitTime, rashiName) {
  const ghatiMs = 24 * 60 * 1000;
  const transitMs = transitTime.getTime();

  // For Makara Sankranti: Punya Kala is 40 Ghatis after transit
  // For Karka Sankranti: 30 Ghatis before transit
  // For other sankrantis: 16 Ghatis before or after depending on tradition
  let punyaStart, punyaEnd, mahaPunyaStart, mahaPunyaEnd;

  if (rashiName === 'Makara') {
    punyaStart = new Date(transitMs);
    punyaEnd = new Date(transitMs + 40 * ghatiMs);
    mahaPunyaStart = new Date(transitMs);
    mahaPunyaEnd = new Date(transitMs + 10 * ghatiMs);
  } else if (rashiName === 'Karka') {
    punyaStart = new Date(transitMs - 30 * ghatiMs);
    punyaEnd = new Date(transitMs);
    mahaPunyaStart = new Date(transitMs - 10 * ghatiMs);
    mahaPunyaEnd = new Date(transitMs);
  } else {
    punyaStart = new Date(transitMs - 16 * ghatiMs);
    punyaEnd = new Date(transitMs + 16 * ghatiMs);
    mahaPunyaStart = new Date(transitMs - 4 * ghatiMs);
    mahaPunyaEnd = new Date(transitMs + 4 * ghatiMs);
  }

  return {
    transitTime,
    punyaKala: { start: punyaStart, end: punyaEnd },
    mahaPunyaKala: { start: mahaPunyaStart, end: mahaPunyaEnd }
  };
}

