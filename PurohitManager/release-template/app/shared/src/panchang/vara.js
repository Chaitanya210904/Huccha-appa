/**
 * Vedic Vara (Weekday) calculation based on Sunrise
 */

export const VARA_NAMES = [
  { index: 0, sanskrit: "Ravivara", devanagari: "रविवार", kannada: "ಭಾನುವಾರ", planet: "Surya", deity: "Sun" },
  { index: 1, sanskrit: "Somavara", devanagari: "सोमवार", kannada: "ಸೋಮವಾರ", planet: "Chandra", deity: "Moon" },
  { index: 2, sanskrit: "Mangalavara", devanagari: "मंगलवार", kannada: "ಮಂಗಳವಾರ", planet: "Mangala", deity: "Mars" },
  { index: 3, sanskrit: "Budhavara", devanagari: "बुधवार", kannada: "ಬುಧವಾರ", planet: "Budha", deity: "Mercury" },
  { index: 4, sanskrit: "Guruvara", devanagari: "गुरुवार", kannada: "ಗುರುವಾರ", planet: "Guru", deity: "Jupiter" },
  { index: 5, sanskrit: "Shukravara", devanagari: "शुक्रवार", kannada: "ಶುಕ್ರವಾರ", planet: "Shukra", deity: "Venus" },
  { index: 6, sanskrit: "Shanivara", devanagari: "शनिवार", kannada: "ಶನಿವಾರ", planet: "Shani", deity: "Saturn" }
];

/**
 * Gets Vedic Vara (starts from local sunrise, not midnight!)
 * @param {Date} date Current date/time
 * @param {Date} sunrise Today's sunrise
 * @returns {object} Vara details
 */
export function getVedicVara(date, sunrise) {
  const d = new Date(date);
  let dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday

  // If time is before today's sunrise, the Vedic day is still the previous day!
  if (sunrise && d.getTime() < sunrise.getTime()) {
    dayOfWeek = (dayOfWeek + 6) % 7;
  }

  return VARA_NAMES[dayOfWeek];
}

