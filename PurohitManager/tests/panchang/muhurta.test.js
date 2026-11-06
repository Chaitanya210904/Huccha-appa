import test from 'node:test';
import assert from 'node:assert';
import { getMuhurtaKala } from '../../shared/src/panchang/muhurta.js';

test('Muhurta: calculates Rahu, Gulika, Yamaganda, and Abhijit', () => {
  const sunrise = new Date('2026-11-04T00:35:00Z'); // 6:05 AM IST
  const sunset = new Date('2026-11-04T12:25:00Z');  // 5:55 PM IST
  const dayOfWeek = 3; // Wednesday (Budhavara)

  const muhurtas = getMuhurtaKala(sunrise, sunset, dayOfWeek);

  assert.ok(muhurtas.rahuKala.start instanceof Date);
  assert.ok(muhurtas.rahuKala.end instanceof Date);
  assert.ok(muhurtas.abhijit.start instanceof Date);
  assert.ok(muhurtas.abhijit.end instanceof Date);
  assert.strictEqual(muhurtas.dayChoghadiyas.length, 8);
});

