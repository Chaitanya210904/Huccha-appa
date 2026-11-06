import fs from 'fs';
import path from 'path';
import { DATA_DIR, BACKUPS_DIR } from '../config/paths.js';
import { logger } from '../utils/logger.js';
import archiver from 'archiver';

export const backupEngine = {
  /**
   * Creates a snapshot backup of the data directory
   * @returns {string} Backup directory path
   */
  createSnapshot() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const targetDir = path.resolve(BACKUPS_DIR, `snapshot-${timestamp}`);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    for (const f of files) {
      fs.copyFileSync(path.resolve(DATA_DIR, f), path.resolve(targetDir, f));
    }

    logger.info(`Snapshot backup created at: ${targetDir}`);
    this.pruneOldSnapshots(30);
    return targetDir;
  },

  /**
   * Prunes older snapshots keeping the most recent `keepCount`
   * @param {number} keepCount 
   */
  pruneOldSnapshots(keepCount = 30) {
    try {
      const dirs = fs.readdirSync(BACKUPS_DIR)
        .filter(d => d.startsWith('snapshot-'))
        .map(d => ({
          name: d,
          path: path.resolve(BACKUPS_DIR, d),
          time: fs.statSync(path.resolve(BACKUPS_DIR, d)).mtimeMs
        }))
        .sort((a, b) => b.time - a.time);

      if (dirs.length > keepCount) {
        const toDelete = dirs.slice(keepCount);
        for (const item of toDelete) {
          fs.rmSync(item.path, { recursive: true, force: true });
          logger.info(`Pruned old backup: ${item.name}`);
        }
      }
    } catch (e) {
      logger.error(`Failed to prune backups: ${e.message}`);
    }
  },

  /**
   * Streams a ZIP archive of the data directory to an HTTP response or file stream
   * @param {stream.Writable} outputStream 
   * @returns {Promise<void>}
   */
  exportZip(outputStream) {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });

      outputStream.on('close', () => resolve());
      archive.on('error', (err) => reject(err));

      archive.pipe(outputStream);

      const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
      for (const f of files) {
        archive.file(path.resolve(DATA_DIR, f), { name: f });
      }

      archive.finalize();
    });
  },

  /**
   * Lists available local backups
   */
  listSnapshots() {
    if (!fs.existsSync(BACKUPS_DIR)) return [];
    return fs.readdirSync(BACKUPS_DIR)
      .filter(d => d.startsWith('snapshot-'))
      .map(d => {
        const fullPath = path.resolve(BACKUPS_DIR, d);
        const stat = fs.statSync(fullPath);
        return {
          id: d,
          createdAt: stat.birthtime || stat.mtime,
          fileCount: fs.readdirSync(fullPath).length
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Restores data from a chosen snapshot directory
   * @param {string} snapshotId 
   */
  restoreSnapshot(snapshotId) {
    const snapshotPath = path.resolve(BACKUPS_DIR, snapshotId);
    if (!fs.existsSync(snapshotPath)) {
      throw new Error(`Snapshot not found: ${snapshotId}`);
    }

    // Safety: backup current state first before restoring
    this.createSnapshot();

    const files = fs.readdirSync(snapshotPath).filter(f => f.endsWith('.json'));
    for (const f of files) {
      fs.copyFileSync(path.resolve(snapshotPath, f), path.resolve(DATA_DIR, f));
    }

    logger.info(`Restored data from snapshot: ${snapshotId}`);
    return true;
  }
};

