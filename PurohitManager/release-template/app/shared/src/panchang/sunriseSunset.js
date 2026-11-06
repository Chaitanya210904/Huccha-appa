/**
 * Vedic Sunrise, Sunset, Solar Noon, Dinamana, and Pancha-Bhaga division
 */

import { toJulianDate } from '../utils/dates.js';

let astronomyEngine = null;
try {
  const mod = await import('astronomy-engine');
  astronomyEngine = mod.default || mod;
} catch (e) {
  astronomyEngine = null;
}

const RAD = Math.PI / 180.0;
const DEG = 180.0 / Math.PI;

/**
 * Standard astronomical calculation of Sunrise, Sunset and Solar Noon
 * @param {Date} date Local calendar date
 * @param {number} lat Latitude in degrees (+ North)
 * @param {number} lon Longitude in degrees (+ East)
 * @param {number} [elevation=0] Elevation in meters
 * @returns {{sunrise: Date, sunset: Date, noon: Date, dinamanaMs: number}}
 */
export function getSunriseSunset(date, lat, lon, elevation = 0) {
  // Try astronomy-engine if available
  if (astronomyEngine) {
    try {
      const observer = new astronomyEngine.Observer(lat, lon, elevation);
      // Look from start of local day
      const d = new Date(date);
      const startOfDay = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0));
      
      const riseTime = astronomyEngine.SearchRiseSet('Sun', observer, +1, startOfDay, 1);
      const setTime = astronomyEngine.SearchRiseSet('Sun', observer, -1, startOfDay, 1);
      const noonTime = astronomyEngine.SearchHourAngle('Sun', observer, 0, startOfDay, 1);

      if (riseTime && setTime) {
        const sunrise = riseTime.date;
        const sunset = setTime.date;
        const noon = noonTime ? noonTime.date : new Date((sunrise.getTime() + sunset.getTime()) / 2);
        const dinamanaMs = sunset.getTime() - sunrise.getTime();

        return buildDayPartitions(sunrise, sunset, noon, dinamanaMs);
      }
    } catch (e) {
      // Fallback to NOAA algorithm below
    }
  }

  // Pure mathematical NOAA Solar Calculator algorithm
  return calculateSunRiseSetNOAA(date, lat, lon);
}

/**
 * NOAA Solar Calculation algorithm fallback
 */
function calculateSunRiseSetNOAA(date, lat, lon) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  // Julian date at 0h UT
  const jd0 = toJulianDate(year, month, day + 0.5);
  const T = (jd0 - 2451545.0) / 36525.0;

  // Mean solar anomaly
  const M = 357.5291 + 35999.05029 * T;
  const Mrad = M * RAD;

  // Equation of center
  const C = (1.914602 - 0.004817 * T) * Math.sin(Mrad) + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad);
  const sunTrueLon = (280.46646 + 36000.76983 * T + C) % 360;

  // Apparent obliquity
  const eps = (23.439291 - 0.0130042 * T) * RAD;

  // Sun declination
  const sinDec = Math.sin(eps) * Math.sin(sunTrueLon * RAD);
  const dec = Math.asin(sinDec);

  // Equation of time in minutes
  const y = Math.tan(eps / 2) * Math.tan(eps / 2);
  const L0rad = (280.46646 + 36000.76983 * T) * RAD;
  const eqTimeMin = 4 * DEG * (
    y * Math.sin(2 * L0rad) -
    2 * 0.016708634 * Math.sin(Mrad) +
    4 * 0.016708634 * y * Math.sin(Mrad) * Math.cos(2 * L0rad) -
    0.5 * y * y * Math.sin(4 * L0rad) -
    1.25 * 0.016708634 * 0.016708634 * Math.sin(2 * Mrad)
  );

  // Solar noon in UT minutes from 00:00 UT
  const noonUTMin = 720 - (lon * 4) - eqTimeMin;

  // Zenith angle for sunrise/sunset (90° 50' accounting for 34' refraction + 16' solar radius)
  const zenithRad = 90.8333 * RAD;
  const latRad = lat * RAD;

  // Hour angle
  const cosH = (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(dec)) / (Math.cos(latRad) * Math.cos(dec));

  let hDeg;
  if (cosH > 1.0) {
    hDeg = 0; // Polar night
  } else if (cosH < -1.0) {
    hDeg = 180; // Midnight sun
  } else {
    hDeg = Math.acos(cosH) * DEG;
  }

  const hMin = hDeg * 4;
  const riseUTMin = noonUTMin - hMin;
  const setUTMin = noonUTMin + hMin;

  const sunrise = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) + riseUTMin * 60000);
  const sunset = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) + setUTMin * 60000);
  const noon = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) + noonUTMin * 60000);
  const dinamanaMs = sunset.getTime() - sunrise.getTime();

  return buildDayPartitions(sunrise, sunset, noon, dinamanaMs);
}

/**
 * Builds Vedic partitions (Pancha-Bhaga, Muhurtas, Dinamana)
 */
function buildDayPartitions(sunrise, sunset, noon, dinamanaMs) {
  const riseMs = sunrise.getTime();
  const setMs = sunset.getTime();
  const partMs = dinamanaMs / 5; // 5-fold division (Pancha-Bhaga)
  const muhurtaMs = dinamanaMs / 15; // 15 Muhurtas of the day

  // Pancha-Bhaga (Crucial for Vedic rituals and Shraddha)
  const pratah = { start: new Date(riseMs), end: new Date(riseMs + partMs) };
  const sangava = { start: new Date(riseMs + partMs), end: new Date(riseMs + 2 * partMs) };
  const madhyahna = { start: new Date(riseMs + 2 * partMs), end: new Date(riseMs + 3 * partMs) };
  const aparahna = { start: new Date(riseMs + 3 * partMs), end: new Date(riseMs + 4 * partMs) };
  const sayahna = { start: new Date(riseMs + 4 * partMs), end: new Date(setMs) };

  // 15 Muhurtas
  const muhurtas = [];
  for (let i = 0; i < 15; i++) {
    muhurtas.push({
      index: i + 1,
      start: new Date(riseMs + i * muhurtaMs),
      end: new Date(riseMs + (i + 1) * muhurtaMs)
    });
  }

  // Abhijit Muhurta is the 8th Muhurta of the day (centered at solar noon)
  const abhijit = muhurtas[7];

  // Kutapa Muhurta (essential for Shraddha, roughly 11:36 - 12:24, identical to 8th Muhurta)
  const kutapa = abhijit;
  // Rohina Muhurta (9th Muhurta, second preference for Shraddha)
  const rohina = muhurtas[8];

  const dinamanaHours = dinamanaMs / (1000 * 60 * 60);

  return {
    sunrise,
    sunset,
    noon,
    dinamanaMs,
    dinamanaFormatted: `${Math.floor(dinamanaHours)}h ${Math.round((dinamanaHours % 1) * 60)}m`,
    panchaBhaga: {
      pratah,
      sangava,
      madhyahna,
      aparahna,
      sayahna
    },
    muhurtas,
    abhijit,
    kutapa,
    rohina
  };
}

