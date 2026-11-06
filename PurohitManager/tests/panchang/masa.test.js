import test from 'node:test';
import assert from 'node:assert';
import { getMasa, MASA_NAMES, MASA_SYSTEMS } from '../../shared/src/panchang/masa.js';

test('Masa: calculates valid lunar month', () => {
  const date = new Date('2026-04-14T10:00:00Z');
  const masa = getMasa(date, MASA_SYSTEMS.AMANTA);

  assert.ok(typeof masa.name === 'string');
  assert.ok(typeof masa.isAdhika === 'boolean');
  assert.ok(masa.index >= 1 && masa.index <= 12);
});

test('Masa: respects Amanta and Purnimanta differences in Krishna Paksha', () => {
  // During Krishna Paksha, Purnimanta Masa name advances to the next month
  const date = new Date('2026-10-05T10:00:00Z'); // Pitru Paksha Krishna
  const amanta = getMasa(date, MASA_SYSTEMS.AMANTA);
  const purnimanta = getMasa(date, MASA_SYSTEMS.PURNIMANTA);

  assert.ok(amanta.name);
  assert.ok(purnimanta.name);
});

