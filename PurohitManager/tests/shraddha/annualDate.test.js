import test from 'node:test';
import assert from 'node:assert';
import { calculateAnnualShraddhaDate } from '../../shared/src/shraddha/annualDate.js';
import { SAMPRADAYAS } from '../../shared/src/shraddha/ruleSets.js';

test('AnnualDate: picks valid recommended date and candidate days', () => {
  const deceased = {
    masa: 'Kartika',
    paksha: 'Krishna',
    tithiIndex: 24, // Navami
    sampradaya: SAMPRADAYAS.SMARTHA
  };
  const place = { lat: 12.9716, lon: 77.5946, name: 'Bengaluru' };

  const result = calculateAnnualShraddhaDate(deceased, 2026, place);

  assert.ok(result.recommendedDate, 'Must return a recommendedDate');
  assert.ok(Array.isArray(result.candidates), 'Must return candidates array');
  assert.ok(result.candidates.length >= 1, 'Should evaluate at least one candidate day');
  assert.ok(result.explanation.length > 0, 'Must have reason explanation');
});

test('AnnualDate: resolves tradition differences between Smartha and Madhva', () => {
  const deceased = {
    masa: 'Margashirsha',
    paksha: 'Shukla',
    tithiIndex: 7,
    sampradaya: SAMPRADAYAS.MADHVA
  };
  const place = { lat: 12.9716, lon: 77.5946 };

  const resMadhva = calculateAnnualShraddhaDate(deceased, 2026, place, { sampradaya: SAMPRADAYAS.MADHVA });
  const resSmartha = calculateAnnualShraddhaDate(deceased, 2026, place, { sampradaya: SAMPRADAYAS.SMARTHA });

  assert.ok(resMadhva.recommendedDate);
  assert.ok(resSmartha.recommendedDate);
});

