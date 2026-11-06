import test from 'node:test';
import assert from 'node:assert';
import { getMahalayaPaksha } from '../../shared/src/shraddha/mahalaya.js';

test('Mahalaya: calculates Pitru Paksha days and special days', () => {
  const place = { lat: 12.9716, lon: 77.5946 };
  const paksha = getMahalayaPaksha(2026, place);

  assert.strictEqual(paksha.year, 2026);
  assert.ok(paksha.startDate, 'Should have startDate');
  assert.ok(paksha.endDate, 'Should have endDate');
  assert.ok(paksha.specialDays.sarvaPitruAmavasya, 'Should identify Sarva Pitru Amavasya');
  assert.ok(paksha.days.length >= 14, 'Pitru Paksha should have 14 to 16 days');
});

