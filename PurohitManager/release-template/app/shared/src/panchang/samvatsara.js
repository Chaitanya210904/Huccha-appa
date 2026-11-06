/**
 * Samvatsara (60-year Jovian cycle), Shaka Samvat, Vikram Samvat, Kali Yuga
 */

export const SAMVATSARA_NAMES = [
  "Prabhava", "Vibhava", "Shukla", "Pramoda", "Prajapati",
  "Angirasa", "Shrimukha", "Bhava", "Yuva", "Dhatri",
  "Ishvara", "Bahudhanya", "Pramathi", "Vikrama", "Vrisha",
  "Chitrabhanu", "Svabhanu", "Tarana", "Parthiva", "Vyaya",
  "Sarvajit", "Sarvadhari", "Virodhi", "Vikrita", "Khara",
  "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukha",
  "Hemalambi", "Vilambi", "Vikari", "Sharvari", "Plava",
  "Shubhakrit", "Shobhakrit", "Krodhi", "Vishvavasu", "Parabhava",
  "Plavanga", "Kilaka", "Saumya", "Sadharana", "Virodhakrit",
  "Paridhavi", "Pramadicha", "Ananda", "Rakshasa", "Nala",
  "Pingala", "Kalayukta", "Siddharthi", "Raudra", "Durmati",
  "Dundubhi", "Rudhirodgari", "Raktakshi", "Krodhana", "Akshaya"
];

/**
 * Calculates Shaka, Vikram, Kali, and 60-year Samvatsara for a given date
 * @param {Date} date 
 * @param {string} [masaName='Chaitra'] Current lunar masa to determine if past Ugadi
 * @returns {object}
 */
export function getSamvatsara(date, masaName = 'Chaitra') {
  const d = new Date(date);
  const gregorianYear = d.getFullYear();

  // Shaka year begins at Chaitra Shukla Prathama (approx late March / early April)
  // If month is Jan, Feb, or early March before Ugadi, it belongs to previous Shaka year
  let isPastUgadi = true;
  if (d.getMonth() < 2 || (d.getMonth() === 2 && d.getDate() < 20)) {
    // If masa is Phalguna or Magha or Pausha, it's definitely before Ugadi
    if (['Magha', 'Phalguna', 'Pausha'].some(m => masaName.includes(m))) {
      isPastUgadi = false;
    }
  }

  const shakaYear = isPastUgadi ? gregorianYear - 78 : gregorianYear - 79;
  const vikramYear = isPastUgadi ? gregorianYear + 57 : gregorianYear + 56;
  const kaliYear = isPastUgadi ? gregorianYear + 3101 : gregorianYear + 3100;

  // Calibrated South Indian / Lunar count formula:
  // Shaka 1946 (2024) -> 38 (Krodhi)
  // Shaka 1947 (2025) -> 39 (Vishvavasu)
  // Shaka 1948 (2026) -> 40 (Parabhava)
  const index = ((shakaYear + 12 - 1) % 60) + 1;
  const name = SAMVATSARA_NAMES[index - 1];

  return {
    index,
    name,
    shakaYear,
    vikramYear,
    kaliYear,
    gregorianYear
  };
}

