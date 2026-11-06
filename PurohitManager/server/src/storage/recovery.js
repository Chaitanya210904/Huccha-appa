import fs from 'fs';
import path from 'path';
import { DATA_DIR, BACKUPS_DIR } from '../config/paths.js';
import { logger } from '../utils/logger.js';

export const recoveryEngine = {
  /**
   * Verifies and recovers a specific JSON file if corrupted
   * @param {string} filePath 
   * @param {any} [defaultFallback=[]] 
   * @returns {any} Intact data
   */
  recoverFile(filePath, defaultFallback = []) {
    if (!fs.existsSync(filePath)) {
      return defaultFallback;
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      logger.error(`Corruption detected in ${filePath}: ${err.message}. Initiating auto-recovery.`);

      // 1. Check if an unfinished .tmp file exists
      const dir = path.dirname(filePath);
      const baseName = path.basename(filePath);
      const tmpFiles = fs.readdirSync(dir).filter(f => f.startsWith(`${baseName}.tmp.`));
      if (tmpFiles.length > 0) {
        for (const tmp of tmpFiles) {
          try {
            const tmpContent = fs.readFileSync(path.resolve(dir, tmp), 'utf8');
            const parsed = JSON.parse(tmpContent);
            fs.copyFileSync(path.resolve(dir, tmp), filePath);
            logger.info(`Successfully recovered ${filePath} from temporary write file: ${tmp}`);
            return parsed;
          } catch (e) {}
        }
      }

      // 2. Search for the latest snapshot in backups/
      if (fs.existsSync(BACKUPS_DIR)) {
        const snapshots = fs.readdirSync(BACKUPS_DIR)
          .filter(d => d.startsWith('snapshot-'))
          .sort()
          .reverse();

        for (const snap of snapshots) {
          const candidate = path.resolve(BACKUPS_DIR, snap, baseName);
          if (fs.existsSync(candidate)) {
            try {
              const content = fs.readFileSync(candidate, 'utf8');
              const parsed = JSON.parse(content);
              // Archive corrupted file
              fs.renameSync(filePath, `${filePath}.corrupted.${Date.now()}`);
              fs.writeFileSync(filePath, content, 'utf8');
              logger.info(`Successfully recovered ${filePath} from snapshot: ${snap}`);
              return parsed;
            } catch (e) {}
          }
        }
      }

      // 3. Fallback: archive corrupted file and write clean fallback
      fs.renameSync(filePath, `${filePath}.corrupted.${Date.now()}`);
      fs.writeFileSync(filePath, JSON.stringify(defaultFallback, null, 2), 'utf8');
      logger.warn(`Could not find valid backup for ${filePath}. Initialized clean fallback.`);
      return defaultFallback;
    }
  }
};

