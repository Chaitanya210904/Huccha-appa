/**
 * Master Panchang Calculation Engine
 * Exports getPanchang(date, place, options)
 */

import { getSunriseSunset } from './sunriseSunset.js';
import { getTithiDetails, getUdayaTithi } from './tithi.js';
import { getNakshatraDetails } from './nakshatra.js';
import { getYogaDetails } from './yoga.js';
import { getKaranaDetails } from './karana.js';
import { getVedicVara } from './vara.js';
import { getMasa, MASA_SYSTEMS } from './masa.js';
import { getSamvatsara } from './samvatsara.js';
import { getRituAyana } from './ritu-ayana.js';
import { getMuhurtaKala } from './muhurta.js';
import { getSolarRashiAt } from './sankranti.js';
import { checkEclipse } from './eclipses.js';
import { AYANAMSA_SYSTEMS, getAyanamsa, formatDMS } from './ayanamsa.js';
import { getThooguPanchanga2026, THOOGU_PANCHANGA_2026 } from './thooguPanchanga2026.js';

export { getThooguPanchanga2026, THOOGU_PANCHANGA_2026 };

/**
 * Calculates complete Vedic Panchang for a given date and location
 * @param {Date|string} dateInput 
 * @param {object} place { lat: number, lon: number, name?: string, tz?: string }
 * @param {object} [options={}] { ayanamsa: 'Lahiri'|'Raman'|'KP', masaSystem: 'Amanta'|'Purnimanta' }
 * @returns {object} Complete Panchang details
 */
export function getPanchang(dateInput, place, options = {}) {
  const date = new Date(dateInput);
  const lat = place?.lat ?? 12.9716; // default Bengaluru
  const lon = place?.lon ?? 77.5946;
  const ayanamsaSystem = options.ayanamsa || AYANAMSA_SYSTEMS.LAHIRI;
  const masaSystem = options.masaSystem || MASA_SYSTEMS.AMANTA;

  // 1. Solar day calculations
  const sunData = getSunriseSunset(date, lat, lon);
  const { sunrise, sunset, noon, dinamanaFormatted, panchaBhaga } = sunData;

  // 2. Vara (sunrise-based weekday)
  const vara = getVedicVara(date, sunrise);

  // 3. Tithi (both current instant and Udaya Tithi at sunrise)
  const currentTithi = getTithiDetails(date, ayanamsaSystem);
  const udayaTithi = getUdayaTithi(sunrise, ayanamsaSystem);

  // 4. Nakshatra
  const nakshatra = getNakshatraDetails(date, ayanamsaSystem);

  // 5. Yoga
  const yoga = getYogaDetails(date, ayanamsaSystem);

  // 6. Karana
  const karana = getKaranaDetails(date, ayanamsaSystem);

  // 7. Masa
  const masa = getMasa(date, masaSystem, ayanamsaSystem);

  // 8. Samvatsara
  const samvatsara = getSamvatsara(date, masa.name);

  // 9. Ayana and Ritu
  const rituAyana = getRituAyana(date, masa.name, ayanamsaSystem);

  // 10. Muhurta timings (Rahu, Gulika, Yamaganda, Abhijit, Choghadiyas)
  const muhurtas = getMuhurtaKala(sunrise, sunset, vara.index);

  // 11. Solar Rashi
  const solarRashi = getSolarRashiAt(date, ayanamsaSystem);

  // 12. Eclipse
  const eclipse = checkEclipse(date, ayanamsaSystem);

  // 13. Ayanamsa details
  const ayanamsaDeg = getAyanamsa(date, ayanamsaSystem);

  // 14. Authoritative Ground-Truth Check for Year 2026 (Chaitanyashrama Thoogu Panchanga)
  const thoogu = getThooguPanchanga2026(date);
  if (thoogu) {
    // Override with authoritative calendar ground-truth values
    udayaTithi.name = thoogu.tithi.name;
    udayaTithi.kannada = thoogu.tithi.kannada;
    udayaTithi.fullKannada = thoogu.tithi.fullKannada;
    udayaTithi.paksha = thoogu.paksha.english;
    udayaTithi.pakshaKannada = thoogu.paksha.kannada;
    udayaTithi.index = thoogu.tithi.index;
    udayaTithi.pakshaTithi = thoogu.tithi.pakshaTithi;
    udayaTithi.isPurnima = thoogu.tithi.isPurnima;
    udayaTithi.isAmavasya = thoogu.tithi.isAmavasya;

    nakshatra.name = thoogu.nakshatra.english;
    nakshatra.kannada = thoogu.nakshatra.kannada;

    vara.name = thoogu.vara.english;
    vara.kannada = thoogu.vara.kannada;
    vara.kannadaShort = thoogu.vara.kannadaShort;
    vara.sanskrit = thoogu.vara.sanskrit;

    samvatsara.name = thoogu.samvatsara.english;
    samvatsara.kannada = thoogu.samvatsara.kannada;
    samvatsara.shaka = thoogu.samvatsara.shaka;
    samvatsara.number = thoogu.samvatsara.number;

    masa.name = thoogu.masa.english;
    masa.kannada = thoogu.masa.kannada;
    masa.isAdhika = thoogu.masa.isAdhika;
    masa.amantaName = thoogu.masa.english;
    masa.purnimantaName = thoogu.masa.english;

    rituAyana.ayana = {
      name: thoogu.ayana.english,
      sanskrit: thoogu.ayana.kannada === "ಉತ್ತರಾಯಣ" ? "उत्तरायणे" : "दक्षिणायने",
      kannada: thoogu.ayana.kannada
    };
    rituAyana.isUttarayana = (thoogu.ayana.english === "Uttarayana");
    rituAyana.ritu = {
      name: thoogu.ritu.english,
      sanskrit: thoogu.ritu.english + " Ritau",
      kannada: thoogu.ritu.kannada
    };
  }

  return {
    date: date.toISOString(),
    place: {
      name: place?.name || 'Custom Location',
      lat,
      lon
    },
    ayanamsa: {
      system: ayanamsaSystem,
      degrees: ayanamsaDeg,
      formatted: formatDMS(ayanamsaDeg)
    },
    sunData: {
      sunrise,
      sunset,
      solarNoon: noon,
      dinamana: dinamanaFormatted,
      panchaBhaga
    },
    // The 5 Angas (Limbs) of Panchang:
    angas: {
      tithi: currentTithi,
      udayaTithi,
      nakshatra,
      yoga,
      karana,
      vara
    },
    // Calendar framing
    calendar: {
      samvatsara,
      ayana: rituAyana.ayana,
      isUttarayana: rituAyana.isUttarayana,
      ritu: rituAyana.ritu,
      masa,
      solarRashi: solarRashi.rashi,
      paksha: udayaTithi.paksha,
      // Thoogu Panchanga ground truth additions:
      isThooguPanchanga: !!thoogu,
      source: thoogu ? "ಶ್ರೀ ಚೈತನ್ಯಾಶ್ರಮ ತೂಗುಪಂಚಾಂಗ ೨೦೨೬ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)" : "Astronomical Model",
      sankashtahara: thoogu?.sankashtahara || null,
      ekadashi: thoogu?.ekadashi || null,
      hunnime: thoogu?.hunnime || null,
      amavasya: thoogu?.amavasya || null,
      isGovtHoliday: thoogu?.isGovtHoliday || false,
      holidayName: thoogu?.holidayName || null,
      holidayNameEn: thoogu?.holidayNameEn || null,
      festivals: thoogu?.festivals || [],
      festivalsEn: thoogu?.festivalsEn || []
    },
    // Muhurtas
    muhurtas,
    eclipse
  };
}

/**
 * Computes Tarabala (strength of daily nakshatra for an individual's birth nakshatra)
 * 9 Taras:
 * 1: Janma (Danger/Caution), 2: Sampat (Wealth/Good), 3: Vipat (Danger),
 * 4: Kshema (Prosperity), 5: Pratyak (Obstacles), 6: Sadhana (Success),
 * 7: Naidhana/Vadha (Severe Danger), 8: Mitra (Friendly), 9: Parama Mitra (Best Friend)
 * @param {number} birthNakshatraIndex 1 to 27
 * @param {number} dailyNakshatraIndex 1 to 27
 * @returns {object}
 */
export function getTarabala(birthNakshatraIndex, dailyNakshatraIndex) {
  const TARA_NAMES = [
    { index: 1, name: "Janma", auspicious: false, quality: "Average / Caution" },
    { index: 2, name: "Sampat", auspicious: true, quality: "Wealth & Prosperity" },
    { index: 3, name: "Vipat", auspicious: false, quality: "Loss / Obstacles" },
    { index: 4, name: "Kshema", auspicious: true, quality: "Wellbeing & Success" },
    { index: 5, name: "Pratyak", auspicious: false, quality: "Setbacks / Delays" },
    { index: 6, name: "Sadhana", auspicious: true, quality: "Achievement & Fulfillment" },
    { index: 7, name: "Naidhana", auspicious: false, quality: "Inauspicious / Avoid" },
    { index: 8, name: "Mitra", auspicious: true, quality: "Friendly & Auspicious" },
    { index: 9, name: "Parama Mitra", auspicious: true, quality: "Highly Auspicious" }
  ];

  let diff = (dailyNakshatraIndex - birthNakshatraIndex + 1);
  if (diff <= 0) diff += 27;
  const count = ((diff - 1) % 9) + 1; // 1 to 9
  return TARA_NAMES[count - 1];
}

/**
 * Computes Chandrabala (Lunar strength based on birth Moon Rashi)
 * Inauspicious houses from Moon: 6th, 8th, 12th
 * @param {number} birthRashiIndex 1 to 12
 * @param {number} currentMoonRashiIndex 1 to 12
 * @returns {object}
 */
export function getChandrabala(birthRashiIndex, currentMoonRashiIndex) {
  let house = (currentMoonRashiIndex - birthRashiIndex + 1);
  if (house <= 0) house += 12;

  const inauspicious = [6, 8, 12].includes(house);
  return {
    house,
    isAuspicious: !inauspicious,
    status: inauspicious ? "Ashtama / Roga Chandra (Weak)" : "Shubha Chandra (Strong)"
  };
}

