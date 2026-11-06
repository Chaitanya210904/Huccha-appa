/**
 * Date and time manipulation helpers for PurohitManager
 */

/**
 * Converts a standard Date or date components into Julian Day Number (UT)
 * @param {Date|number} dateOrYear 
 * @param {number} [month] 1-12
 * @param {number} [day] 1-31 (can include fraction)
 * @returns {number} Julian Date (JD)
 */
export function toJulianDate(dateOrYear, month, day) {
  let y, m, d;
  if (dateOrYear instanceof Date) {
    y = dateOrYear.getUTCFullYear();
    m = dateOrYear.getUTCMonth() + 1;
    d = dateOrYear.getUTCDate() +
      dateOrYear.getUTCHours() / 24 +
      dateOrYear.getUTCMinutes() / 1440 +
      dateOrYear.getUTCSeconds() / 86400 +
      dateOrYear.getUTCMilliseconds() / 86400000;
  } else {
    y = dateOrYear;
    m = month;
    d = day;
  }

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d + B - 1524.5;
}

/**
 * Converts Julian Day Number to JavaScript Date (UTC)
 * @param {number} jd 
 * @returns {Date}
 */
export function fromJulianDate(jd) {
  const z = Math.floor(jd + 0.5);
  const f = (jd + 0.5) - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36424.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e) + f;
  const month = (e < 14) ? e - 1 : e - 13;
  const year = (month > 2) ? c - 4716 : c - 4715;

  const dayInt = Math.floor(day);
  const dayFrac = day - dayInt;
  const hours = Math.floor(dayFrac * 24);
  const minutes = Math.floor((dayFrac * 24 - hours) * 60);
  const seconds = Math.floor(((dayFrac * 24 - hours) * 60 - minutes) * 60);
  const ms = Math.round((((dayFrac * 24 - hours) * 60 - minutes) * 60 - seconds) * 1000);

  return new Date(Date.UTC(year, month - 1, dayInt, hours, minutes, seconds, ms));
}

/**
 * Formats a Date object into YYYY-MM-DD
 * @param {Date} date 
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date into HH:mm (24-hour)
 * @param {Date} date 
 * @returns {string}
 */
export function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
}

/**
 * Formats Date into user-friendly AM/PM string
 * @param {Date} date 
 * @returns {string}
 */
export function formatTime12(date) {
  if (!date) return '';
  const d = new Date(date);
  let hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${mins} ${ampm}`;
}

/**
 * Normalizes angle into [0, 360) range
 * @param {number} deg 
 * @returns {number}
 */
export function normalize360(deg) {
  let val = deg % 360;
  if (val < 0) val += 360;
  return val;
}

/**
 * Normalizes angle into [-180, 180) range
 * @param {number} deg 
 * @returns {number}
 */
export function normalize180(deg) {
  let val = normalize360(deg);
  if (val >= 180) val -= 360;
  return val;
}

/**
 * Adds days to a Date
 * @param {Date} date 
 * @param {number} days 
 * @returns {Date}
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Difference in days between two dates
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {number}
 */
export function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(date2).setHours(0,0,0,0) - new Date(date1).setHours(0,0,0,0)) / oneDay);
}

