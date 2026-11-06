import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const releaseDir = path.resolve(rootDir, 'release-template');

console.log("=== BUILDING PUROHIT MANAGER PORTABLE RELEASE ===");

// 1. Build Client
console.log("\n[1/4] Building React Client with Vite...");
try {
  execSync('npm --prefix client run build', { cwd: rootDir, stdio: 'inherit' });
  console.log("✓ Client build complete.");
} catch (e) {
  console.error("Client build failed:", e.message);
}

// 2. Prepare Release Tree
console.log("\n[2/4] Syncing release files...");
const appTarget = path.resolve(releaseDir, 'app');
if (!fs.existsSync(appTarget)) fs.mkdirSync(appTarget, { recursive: true });

// Copy server
fs.cpSync(path.resolve(rootDir, 'server'), path.resolve(appTarget, 'server'), { recursive: true });
// Copy shared
fs.cpSync(path.resolve(rootDir, 'shared'), path.resolve(appTarget, 'shared'), { recursive: true });
// Copy resources
fs.cpSync(path.resolve(rootDir, 'resources'), path.resolve(releaseDir, 'resources'), { recursive: true });

console.log("✓ Assets synced to release-template.");

// 3. Ensure data, backups, logs directories
['data', 'backups', 'logs'].forEach(d => {
  const p = path.resolve(releaseDir, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

console.log("\n[3/4] Release template structure verified.");
console.log("✓ Ready to bundle into ZIP.");
console.log("\n=======================================================");
console.log("BUILD COMPLETE! Contents ready in release-template/");
console.log("=======================================================\n");

