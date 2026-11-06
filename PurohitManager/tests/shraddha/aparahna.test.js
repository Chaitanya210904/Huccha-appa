import test from 'node:test';
import assert from 'node:assert';
import { getAparahnaWindow, getAparahnaOverlap } from '../../shared/src/shraddha/aparahna.js';

test('Aparahna: calculates 4th part of daytime correctly', () => {
  const date = new Date('2026-11-04');
  const lat = 12.9716;
  const lon = 77.5946;

  const window = getAparahnaWindow(date, lat, lon);

  assert.ok(window.aparahnaStart instanceof Date);
  assert.ok(window.aparahnaEnd instanceof Date);
  assert.ok(window.aparahnaEnd.getTime() > window.aparahnaStart.getTime());
  assert.ok(window.aparahnaDurationMinutes > 100);
});

test('Aparahna: overlap calculation works accurately', () => {
  const aparahnaStart = new Date('2026-11-04T07:30:00Z');
  const aparahnaEnd = new Date('2026-11-04T09:45:00Z');

  // Case 1: Tithi covers entire aparahna
  const tithiStart1 = new Date('2026-11-04T06:00:00Z');
  const tithiEnd1 = new Date('2026-11-04T11:00:00Z');
  const overlap1 = getAparahnaOverlap(tithiStart1, tithiEnd1, aparahnaStart, aparahnaEnd);
  assert.strictEqual(overlap1, aparahnaEnd.getTime() - aparahnaStart.getTime());

  // Case 2: Tithi ends halfway through aparahna
  const tithiStart2 = new Date('2026-11-04T06:00:00Z');
  const tithiEnd2 = new Date('2026-11-04T08:30:00Z'); // 60 mins into aparahna
  const overlap2 = getAparahnaOverlap(tithiStart2, tithiEnd2, aparahnaStart, aparahnaEnd);
  assert.strictEqual(overlap2, 60 * 60 * 1000);

  // Case 3: No overlap
  const tithiStart3 = new Date('2026-11-04T10:00:00Z');
  const tithiEnd3 = new Date('2026-11-04T14:00:00Z');
  const overlap3 = getAparahnaOverlap(tithiStart3, tithiEnd3, aparahnaStart, aparahnaEnd);
  assert.strictEqual(overlap3, 0);
});

