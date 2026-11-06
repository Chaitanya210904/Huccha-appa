import fs from 'fs';
import { ENTITY_FILES } from '../../config/paths.js';
import { jsonStore } from '../jsonStore.js';
import { logger } from '../../utils/logger.js';
import * as m001 from './001_initial.js';

const MIGRATIONS = [
  { version: 1, name: '001_initial', migration: m001 }
];

export async function runMigrations() {
  let metadata = { version: 0, lastRun: null };

  if (fs.existsSync(ENTITY_FILES.metadata)) {
    metadata = jsonStore.read(ENTITY_FILES.metadata, metadata);
  }

  for (const m of MIGRATIONS) {
    if (m.version > metadata.version) {
      logger.info(`Running migration ${m.name} (v${m.version})...`);
      await m.migration.up();
      metadata.version = m.version;
      metadata.lastRun = new Date().toISOString();
      await jsonStore.write(ENTITY_FILES.metadata, metadata);
      logger.info(`Migration ${m.name} applied successfully.`);
    }
  }
}

