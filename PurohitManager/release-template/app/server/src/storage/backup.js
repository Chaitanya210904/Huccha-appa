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
   * Creates an in-memory ZIP buffer of the data directory and any optional extra files
   * @param {Array<{ name: string, content: string|Buffer }>} [extraFiles]
   * @returns {Promise<Buffer>}
   */
  createZipBuffer(extraFiles = []) {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const buffers = [];

      archive.on('data', chunk => buffers.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', err => reject(err));

      const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
      for (const f of files) {
        archive.file(path.resolve(DATA_DIR, f), { name: f });
      }

      if (Array.isArray(extraFiles)) {
        for (const ef of extraFiles) {
          if (ef && ef.name && ef.content) {
            const buf = Buffer.isBuffer(ef.content)
              ? ef.content
              : Buffer.from(typeof ef.content === 'object' ? JSON.stringify(ef.content, null, 2) : ef.content, 'utf-8');
            archive.append(buf, { name: ef.name });
          }
        }
      }

      archive.finalize();
    });
  },

  /**
   * Restores data from uploaded files array
   * Automatically takes a safety snapshot first.
   * @param {Array<{ name: string, content: string|Object }>} files
   * @returns {{ restoredCount: number }}
   */
  restoreFromFiles(files = []) {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("No files provided for restore");
    }

    // Safety snapshot first
    this.createSnapshot();

    let restoredCount = 0;
    for (const file of files) {
      const filename = path.basename(file.name || '');
      if (!filename.endsWith('.json')) continue;

      const dest = path.resolve(DATA_DIR, filename);
      let content = file.content;
      if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2);
      }
      fs.writeFileSync(dest, content, 'utf-8');
      restoredCount++;
    }

    logger.info(`Restored ${restoredCount} files from user upload`);
    return { restoredCount };
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

