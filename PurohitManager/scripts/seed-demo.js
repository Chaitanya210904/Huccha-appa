import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const demoFile = path.resolve(rootDir, 'resources/demoData/sampleData.json');
const dataDir = path.resolve(rootDir, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(demoFile)) {
  console.error("Demo data file not found at:", demoFile);
  process.exit(1);
}

const demoData = JSON.parse(fs.readFileSync(demoFile, 'utf8'));

for (const [entity, data] of Object.entries(demoData)) {
  const target = path.resolve(dataDir, `${entity}.json`);
  fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Seeded ${entity}.json (${Array.isArray(data) ? data.length + ' records' : 'object'})`);
}

console.log("\n🪔 Sample demo data seeded successfully into data/ directory.");

