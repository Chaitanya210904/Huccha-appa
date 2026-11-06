import test from 'node:test';
import assert from 'node:assert';
import { getSolarRashiAt, findSankrantiMoment, getPunyaKala, RASHI_NAMES } from '../../shared/src/panchang/sankranti.js';

test('Sankranti: detects correct solar rashi', () => {
  // Near late April, Sun is in Mesha
  const date = new Date('2026-04-20T12:00:00Z');
  const solar = getSolarRashiAt(date);

  assert.strictEqual(solar.rashi.sanskrit, 'Mesha');
  assert.ok(solar.degreesInRashi >= 0 && solar.degreesInRashi < 30);
});

test('Sankranti: computes Punya Kala window around transit', () => {
  const transitTime = new Date('2026-01-14T21:30:00Z');
  const pk = getPunyaKala(transitTime, 'Makara');

  assert.ok(pk.punyaKala.start instanceof Date);
  assert.ok(pk.punyaKala.end instanceof Date);
  assert.ok(pk.punyaKala.end.getTime() > pk.punyaKala.start.getTime());
});

