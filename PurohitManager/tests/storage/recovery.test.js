import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { recoveryEngine } from '../../server/src/storage/recovery.js';

test('Recovery: detects invalid JSON and initializes clean fallback without crashing', () => {
  const testFile = path.resolve(process.cwd(), 'data/test_corrupt.json');
  // Write deliberately invalid JSON syntax
  fs.writeFileSync(testFile, '{"incomplete_json": [1, 2, 3', 'utf8');

  const recovered = recoveryEngine.recoverFile(testFile, []);
  assert.ok(Array.isArray(recovered), 'Must return fallback array');

  // Clean up
  if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  const corruptedArchive = fs.readdirSync(path.dirname(testFile))
    .filter(f => f.startsWith('test_corrupt.json.corrupted'));
  for (const f of corruptedArchive) {
    fs.unlinkSync(path.resolve(path.dirname(testFile), f));
  }
});

