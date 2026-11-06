/**
 * Ayana (Uttarayana / Dakshinayana) and Ritu (6 Vedic Seasons)
 */

import { getSolarRashiAt } from './sankranti.js';
import { AYANAMSA_SYSTEMS } from './ayanamsa.js';

export const RITU_NAMES = [
  { index: 1, sanskrit: "Vasanta", english: "Spring", devanagari: "वसन्त", kannada: "ವಸಂತ", masas: ["Chaitra", "Vaishakha"] },
  { index: 2, sanskrit: "Grishma", english: "Summer", devanagari: "ग्रीष्म", kannada: "ಗ್ರೀಷ್ಮ", masas: ["Jyeshtha", "Ashadha"] },
  { index: 3, sanskrit: "Varsha", english: "Monsoon", devanagari: "वर्षा", kannada: "ವರ್ಷಾ", masas: ["Shravana", "Bhadrapada"] },
  { index: 4, sanskrit: "Sharad", english: "Autumn", devanagari: "शरद्", kannada: "ಶರದ್", masas: ["Ashvina", "Kartika"] },
  { index: 5, sanskrit: "Hemanta", english: "Pre-winter", devanagari: "हेमन्त", kannada: "ಹೇಮಂತ", masas: ["Margashirsha", "Pausha"] },
  { index: 6, sanskrit: "Shishira", english: "Winter", devanagari: "शिशिर", kannada: "ಶಿಶಿರ", masas: ["Magha", "Phalguna"] }
];

export const AYANA_NAMES = {
  UTTARAYANA: { sanskrit: "Uttarayana", devanagari: "उत्तरायण", kannada: "ಉತ್ತರಾಯಣ" },
  DAKSHINAYANA: { sanskrit: "Dakshinayana", devanagari: "दक्षिणायन", kannada: "ದಕ್ಷಿಣಾಯನ" }
};

/**
 * Calculates Ayana and Ritu for a given date
 * @param {Date} date 
 * @param {string} [masaName=''] 
 * @param {string} [system='Lahiri'] 
 * @returns {object}
 */
export function getRituAyana(date, masaName = '', system = AYANAMSA_SYSTEMS.LAHIRI) {
  const solarRashi = getSolarRashiAt(date, system);
  const rashiIndex = solarRashi.index; // 1 (Mesha) to 12 (Meena)

  // Uttarayana: Sun in Makara (10), Kumbha (11), Meena (12), Mesha (1), Vrishabha (2), Mithuna (3)
  // Dakshinayana: Sun in Karka (4), Simha (5), Kanya (6), Tula (7), Vrishchika (8), Dhanu (9)
  const isUttarayana = [10, 11, 12, 1, 2, 3].includes(rashiIndex);
  const ayana = isUttarayana ? AYANA_NAMES.UTTARAYANA : AYANA_NAMES.DAKSHINAYANA;

  // Determine Ritu from Masa if available, otherwise from Solar Rashi
  let rituIndex = 1;
  const cleanMasa = masaName.replace('Adhika ', '');
  const foundByMasa = RITU_NAMES.find(r => r.masas.includes(cleanMasa));

  if (foundByMasa) {
    rituIndex = foundByMasa.index;
  } else {
    // Rashi mapping:
    // Mesha/Vrishabha (1,2) -> Vasanta (1)
    // Mithuna/Karka (3,4) -> Grishma (2)
    // Simha/Kanya (5,6) -> Varsha (3)
    // Tula/Vrishchika (7,8) -> Sharad (4)
    // Dhanu/Makara (9,10) -> Hemanta (5)
    // Kumbha/Meena (11,12) -> Shishira (6)
    rituIndex = Math.floor((rashiIndex - 1) / 2) + 1;
  }

  const ritu = RITU_NAMES[rituIndex - 1];

  return {
    ayana,
    isUttarayana,
    ritu,
    solarRashi: solarRashi.rashi
  };
}

