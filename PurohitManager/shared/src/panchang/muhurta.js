/**
 * Muhurta calculations: Rahu Kala, Gulika, Yamaganda, Abhijit, Choghadiya, Brahma Muhurta
 */

// Part of the day (1 to 8) for Rahu Kala by weekday (0 = Sun, 1 = Mon ... 6 = Sat)
const RAHU_KALA_PARTS = [8, 2, 7, 5, 6, 4, 3];

// Part of the day (1 to 8) for Gulika Kala
const GULIKA_KALA_PARTS = [7, 6, 5, 4, 3, 2, 1];

// Part of the day (1 to 8) for Yamaganda Kala
const YAMAGANDA_PARTS = [5, 4, 3, 2, 1, 7, 6];

// Day Choghadiya starting ruler by weekday
// 7 Choghadiya names and qualities:
// Udveg (Inauspicious), Chala (Neutral), Labha (Auspicious), Amrit (Best), Kala (Inauspicious), Shubha (Auspicious), Roga (Inauspicious)
export const CHOGHADIYA_TYPES = [
  { name: "Udveg", quality: "Inauspicious", ruler: "Surya" },
  { name: "Chala", quality: "Neutral", ruler: "Shukra" },
  { name: "Labha", quality: "Auspicious", ruler: "Budha" },
  { name: "Amrit", quality: "Best", ruler: "Chandra" },
  { name: "Kala", quality: "Inauspicious", ruler: "Shani" },
  { name: "Shubha", quality: "Auspicious", ruler: "Guru" },
  { name: "Roga", quality: "Inauspicious", ruler: "Mangala" }
];

const DAY_CHOGHADIYA_ORDER = [
  [0, 1, 2, 3, 4, 5, 6, 0], // Sun: Udveg, Chala, Labha, Amrit, Kala, Shubha, Roga, Udveg
  [3, 4, 5, 6, 0, 1, 2, 3], // Mon: Amrit, Kala, Shubha, Roga, Udveg, Chala, Labha, Amrit
  [6, 0, 1, 2, 3, 4, 5, 6], // Tue: Roga, Udveg, Chala, Labha, Amrit, Kala, Shubha, Roga
  [2, 3, 4, 5, 6, 0, 1, 2], // Wed: Labha, Amrit, Kala, Shubha, Roga, Udveg, Chala, Labha
  [5, 6, 0, 1, 2, 3, 4, 5], // Thu: Shubha, Roga, Udveg, Chala, Labha, Amrit, Kala, Shubha
  [1, 2, 3, 4, 5, 6, 0, 1], // Fri: Chala, Labha, Amrit, Kala, Shubha, Roga, Udveg, Chala
  [4, 5, 6, 0, 1, 2, 3, 4]  // Sat: Kala, Shubha, Roga, Udveg, Chala, Labha, Amrit, Kala
];

/**
 * Calculates Rahu, Gulika, Yamaganda, Abhijit, and Choghadiyas for a day
 * @param {Date} sunrise 
 * @param {Date} sunset 
 * @param {number} dayOfWeek 0 (Sunday) to 6 (Saturday)
 * @returns {object}
 */
export function getMuhurtaKala(sunrise, sunset, dayOfWeek) {
  const riseMs = sunrise.getTime();
  const setMs = sunset.getTime();
  const dinamanaMs = setMs - riseMs;
  const partMs = dinamanaMs / 8; // 8 Yamas / Ashtama-bhaga

  // 1. Rahu Kala
  const rahuPart = RAHU_KALA_PARTS[dayOfWeek];
  const rahuKala = {
    name: "Rahu Kala",
    start: new Date(riseMs + (rahuPart - 1) * partMs),
    end: new Date(riseMs + rahuPart * partMs)
  };

  // 2. Gulika Kala
  const gulikaPart = GULIKA_KALA_PARTS[dayOfWeek];
  const gulikaKala = {
    name: "Gulika Kala",
    start: new Date(riseMs + (gulikaPart - 1) * partMs),
    end: new Date(riseMs + gulikaPart * partMs)
  };

  // 3. Yamaganda Kala
  const yamaPart = YAMAGANDA_PARTS[dayOfWeek];
  const yamagandaKala = {
    name: "Yamaganda",
    start: new Date(riseMs + (yamaPart - 1) * partMs),
    end: new Date(riseMs + yamaPart * partMs)
  };

  // 4. Abhijit Muhurta (8th of the 15 Muhurtas of the day)
  const muhurtaMs = dinamanaMs / 15;
  const abhijit = {
    name: "Abhijit Muhurta",
    start: new Date(riseMs + 7 * muhurtaMs),
    end: new Date(riseMs + 8 * muhurtaMs)
  };

  // 5. Brahma Muhurta (2 Muhurtas = 96 minutes before sunrise)
  const brahmaMuhurta = {
    name: "Brahma Muhurta",
    start: new Date(riseMs - 2 * 48 * 60 * 1000),
    end: new Date(riseMs - 48 * 60 * 1000)
  };

  // 6. Day Choghadiyas
  const dayChoghadiyaIndices = DAY_CHOGHADIYA_ORDER[dayOfWeek];
  const dayChoghadiyas = dayChoghadiyaIndices.map((idx, i) => {
    const ch = CHOGHADIYA_TYPES[idx];
    return {
      name: ch.name,
      quality: ch.quality,
      ruler: ch.ruler,
      start: new Date(riseMs + i * partMs),
      end: new Date(riseMs + (i + 1) * partMs)
    };
  });

  return {
    rahuKala,
    gulikaKala,
    yamagandaKala,
    abhijit,
    brahmaMuhurta,
    dayChoghadiyas
  };
}

