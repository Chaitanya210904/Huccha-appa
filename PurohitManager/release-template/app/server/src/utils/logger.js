import fs from 'fs';
import path from 'path';
import { LOGS_DIR } from '../config/paths.js';

const logFile = path.resolve(LOGS_DIR, 'app.log');

export const logger = {
  info(msg, meta = '') {
    this.write('INFO', msg, meta);
  },
  warn(msg, meta = '') {
    this.write('WARN', msg, meta);
  },
  error(msg, meta = '') {
    this.write('ERROR', msg, meta);
  },
  write(level, msg, meta = '') {
    const time = new Date().toISOString();
    const metaStr = meta ? (typeof meta === 'object' ? ` ${JSON.stringify(meta)}` : ` ${meta}`) : '';
    const line = `[${time}] [${level}] ${msg}${metaStr}\n`;
    
    // Print to stdout/stderr
    if (level === 'ERROR') {
      console.error(`[${level}] ${msg}`, meta);
    } else {
      console.log(`[${level}] ${msg}`, meta);
    }

    try {
      // Append to file
      fs.appendFileSync(logFile, line);
    } catch (e) {
      // Ignore disk logging error during shutdown
    }
  }
};

