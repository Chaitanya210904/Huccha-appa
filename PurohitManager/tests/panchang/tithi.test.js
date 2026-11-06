import test from 'node:test';
import assert from 'node:assert';
import { getTithiAt, getTithiDetails, TITHI_NAMES } from '../../shared/src/panchang/tithi.js';

test('Tithi: index is within 1 to 30', () => {
  const date = new Date('2026-03-20T06:00:00Z');
  const tithi = getTithiAt(date);

  assert.ok(tithi.index >= 1 && tithi.index <= 30, `Tithi index ${tithi.index} should be in 1..30`);
  assert.ok(['Shukla', 'Krishna'].includes(tithi.paksha), 'Paksha must be Shukla or Krishna');
  assert.ok(typeof tithi.name === 'string' && tithi.name.length > 0);
});

test('Tithi: exact start and end times are valid Dates', () => {
  const date = new Date('2026-04-14T12:00:00Z');
  const details = getTithiDetails(date);

  assert.ok(details.startTime instanceof Date, 'startTime should be Date');
  assert.ok(details.endTime instanceof Date, 'endTime should be Date');
  assert.ok(details.endTime.getTime() > details.startTime.getTime(), 'endTime should be after startTime');
});

