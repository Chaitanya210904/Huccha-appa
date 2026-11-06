import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { jsonStore } from '../../server/src/storage/jsonStore.js';

test('AtomicWrite: writes data safely and reads it back', async () => {
  const testFile = path.resolve(process.cwd(), 'data/test_atomic.json');
  const testData = { name: "Test Client", gotra: "Kashyapa", count: 42 };

  await jsonStore.write(testFile, testData);
  assert.ok(fs.existsSync(testFile), 'Target file must exist');

  const readBack = jsonStore.read(testFile);
  assert.deepStrictEqual(readBack, testData);

  // Clean up
  if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
});

test('AtomicWrite: handles concurrent writes without corruption', async () => {
  const testFile = path.resolve(process.cwd(), 'data/test_concurrent.json');
  await jsonStore.write(testFile, []);

  // Dispatch 10 concurrent transactional updates
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      jsonStore.update(testFile, (cur) => {
        cur.push({ index: i, timestamp: Date.now() });
        return cur;
      })
    );
  }

  await Promise.all(promises);

  const finalData = jsonStore.read(testFile);
  assert.strictEqual(finalData.length, 10, 'All 10 items must be safely written');

  if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
});
