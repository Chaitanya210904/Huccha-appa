import { getPanchang } from '../shared/src/panchang/index.js';
import { getFestivalsForDate } from '../shared/src/festivals/engine.js';
import { calculateAnnualShraddhaDate } from '../shared/src/shraddha/annualDate.js';
import { generateSankalpa } from '../shared/src/sankalpa/generator.js';

const place = { lat: 15.3647, lon: 75.1240, name: 'Dharwad' };

console.log('=== TEST 1: 2026-01-15 (Makara Sankranti) ===');
const pJan15 = getPanchang('2026-01-15', place);
console.log('Tithi:', pJan15.angas.udayaTithi.fullKannada, '| Masa:', pJan15.calendar.masa.kannada, '| Samvatsara:', pJan15.calendar.samvatsara.kannada);
console.log('Holiday:', pJan15.calendar.holidayName);

console.log('\n=== TEST 2: 2026-03-19 (Ugadi) ===');
const pUgadi = getPanchang('2026-03-19', place);
console.log('Tithi:', pUgadi.angas.udayaTithi.fullKannada, '| Samvatsara:', pUgadi.calendar.samvatsara.kannada, '| Masa:', pUgadi.calendar.masa.kannada);
const fUgadi = getFestivalsForDate('2026-03-19', place);
console.log('Festivals:', fUgadi.map(f => f.kannada));

console.log('\n=== TEST 3: 2026-05-17 (Adhika Masa Start) ===');
const pMay17 = getPanchang('2026-05-17', place);
console.log('Tithi:', pMay17.angas.udayaTithi.fullKannada, '| Masa:', pMay17.calendar.masa.kannada, '| IsAdhika:', pMay17.calendar.masa.isAdhika);

console.log('\n=== TEST 4: 2026-06-16 (Nija Jyeshtha Start) ===');
const pJun16 = getPanchang('2026-06-16', place);
console.log('Tithi:', pJun16.angas.udayaTithi.fullKannada, '| Masa:', pJun16.calendar.masa.kannada, '| IsAdhika:', pJun16.calendar.masa.isAdhika);

console.log('\n=== TEST 5: 2026-07-17 (Dakshinayana Start) ===');
const pJul17 = getPanchang('2026-07-17', place);
console.log('Ayana:', pJul17.calendar.ayana.kannada, '| Tithi:', pJul17.angas.udayaTithi.fullKannada);

console.log('\n=== TEST 6: 2026-09-14 (Ganesha Chaturthi) ===');
const pGanesh = getPanchang('2026-09-14', place);
console.log('Tithi:', pGanesh.angas.udayaTithi.fullKannada, '| Nakshatra:', pGanesh.angas.nakshatra.kannada);
console.log('Holiday:', pGanesh.calendar.holidayName);

console.log('\n=== TEST 7: Sankashti Moonrise Checks ===');
const pJan6 = getPanchang('2026-01-06', place);
console.log('2026-01-06 Sankashti Moonrise:', pJan6.calendar.sankashtahara?.moonrise, 'Angaraki:', pJan6.calendar.sankashtahara?.isAngaraki);
const pOct29 = getPanchang('2026-10-29', place);
console.log('2026-10-29 Sankashti Moonrise:', pOct29.calendar.sankashtahara?.moonrise);

console.log('\n=== TEST 8: Sankalpa Text for Ugadi ===');
const sankalpa = generateSankalpa({
  date: '2026-03-19',
  place,
  client: { name: 'Chaitanya', gotra: 'Kashyapa' },
  serviceType: 'satyanarayana'
});
console.log('Kannada Sankalpa:\n', sankalpa.kannadaText);
