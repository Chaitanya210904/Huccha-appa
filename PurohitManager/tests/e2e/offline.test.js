import test from 'node:test';
import assert from 'node:assert';
import { getPanchang } from '../../shared/src/panchang/index.js';
import { createApp } from '../../server/src/app.js';

test('Offline E2E: App boots and calculates Panchang without external network', () => {
  const app = createApp();
  assert.ok(app, 'Express app must instantiate offline');

  const panchang = getPanchang(new Date('2026-11-04'), { lat: 12.9716, lon: 77.5946 });

  assert.ok(panchang.angas.udayaTithi.name);
  assert.ok(panchang.angas.nakshatra.name);
  assert.ok(panchang.angas.vara.sanskrit);
  assert.ok(panchang.calendar.samvatsara.name);
  assert.ok(panchang.sunData.dinamana);
});

