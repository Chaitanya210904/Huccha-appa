import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root can be environment-specified or relative to server
const rootDir = process.env.PUROHIT_DATA_DIR
  ? path.resolve(process.env.PUROHIT_DATA_DIR)
  : path.resolve(__dirname, '../../../');

export const DATA_DIR = path.resolve(rootDir, 'data');
export const BACKUPS_DIR = path.resolve(rootDir, 'backups');
export const LOGS_DIR = path.resolve(rootDir, 'logs');
export const RESOURCES_DIR = path.resolve(rootDir, 'resources');

// Ensure essential directories exist
[DATA_DIR, BACKUPS_DIR, LOGS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export const ENTITY_FILES = {
  settings: path.resolve(DATA_DIR, 'settings.json'),
  clients: path.resolve(DATA_DIR, 'clients.json'),
  familyMembers: path.resolve(DATA_DIR, 'familyMembers.json'),
  deceased: path.resolve(DATA_DIR, 'deceased.json'),
  bookings: path.resolve(DATA_DIR, 'bookings.json'),
  services: path.resolve(DATA_DIR, 'services.json'),
  payments: path.resolve(DATA_DIR, 'payments.json'),
  expenses: path.resolve(DATA_DIR, 'expenses.json'),
  inventory: path.resolve(DATA_DIR, 'inventory.json'),
  pujaSamagri: path.resolve(DATA_DIR, 'pujaSamagri.json'),
  assistants: path.resolve(DATA_DIR, 'assistants.json'),
  metadata: path.resolve(DATA_DIR, 'metadata.json')
};

