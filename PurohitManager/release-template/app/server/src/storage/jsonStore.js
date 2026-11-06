import fs from 'fs';
import path from 'path';
import { writeQueue } from './writeQueue.js';
import { logger } from '../utils/logger.js';

/**
 * Atomic JSON store: writes to temporary file, syncs to disk (fsync), and renames
 */
export const jsonStore = {
  /**
   * Reads and parses a JSON file. If file does not exist, returns fallback.
   * @param {string} filePath 
   * @param {any} [fallback=[]] 
   * @returns {any}
   */
  read(filePath, fallback = []) {
    try {
      if (!fs.existsSync(filePath)) {
        return fallback;
      }
      const raw = fs.readFileSync(filePath, 'utf8');
      if (!raw || raw.trim() === '') {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (err) {
      logger.error(`Error reading JSON from ${filePath}: ${err.message}`);
      return fallback;
    }
  },

  /**
   * Writes data atomically into temporary file and renames
   */
  _writeInternal(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 6)}`;
    const jsonStr = JSON.stringify(data, null, 2);

    let fd;
    try {
      fd = fs.openSync(tempPath, 'w');
      fs.writeSync(fd, jsonStr, 0, 'utf8');
      fs.fsyncSync(fd);
      fs.closeSync(fd);
      fd = null;

      // Atomic replace
      fs.renameSync(tempPath, filePath);
      return true;
    } catch (err) {
      if (fd !== null && fd !== undefined) {
        try { fs.closeSync(fd); } catch (e) {}
      }
      if (fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch (e) {}
      }
      logger.error(`Atomic write failed for ${filePath}: ${err.message}`);
      throw err;
    }
  },

  /**
   * Writes data atomically into JSON file via temp file -> fsync -> rename
   * Uses writeQueue mutex to prevent concurrent write collisions.
   * @param {string} filePath 
   * @param {any} data 
   * @returns {Promise<boolean>}
   */
  async write(filePath, data) {
    return writeQueue.enqueue(filePath, async () => {
      return this._writeInternal(filePath, data);
    });
  },

  /**
   * Transactional atomic update: reads, executes updater, and writes all inside the mutex queue
   * @param {string} filePath 
   * @param {Function} updater (current) => newContent
   * @returns {Promise<any>}
   */
  async update(filePath, updater) {
    return writeQueue.enqueue(filePath, async () => {
      const current = this.read(filePath);
      const updated = await updater(current);
      this._writeInternal(filePath, updated);
      return updated;
    });
  }
};
