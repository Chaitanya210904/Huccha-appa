import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import { runMigrations } from '../../server/src/storage/migrations/index.js';
import { ENTITY_FILES } from '../../server/src/config/paths.js';

test('Migrations: initializes default services and settings', async () => {
  await runMigrations();

  assert.ok(fs.existsSync(ENTITY_FILES.services), 'Services file must exist');
  assert.ok(fs.existsSync(ENTITY_FILES.settings), 'Settings file must exist');
  assert.ok(fs.existsSync(ENTITY_FILES.metadata), 'Metadata file must exist');
});

