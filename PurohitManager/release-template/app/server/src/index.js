import net from 'net';
import http from 'http';
import { exec } from 'child_process';
import { createApp } from './app.js';
import { runMigrations } from './storage/migrations/index.js';
import { logger } from './utils/logger.js';

const DEFAULT_PORT = parseInt(process.env.PORT || '3456', 10);

/**
 * Finds a free TCP port starting from preferredPort
 */
function findFreePort(preferredPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(preferredPort, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      // Preferred port busy, find an arbitrary free port
      const fallbackServer = net.createServer();
      fallbackServer.listen(0, '127.0.0.1', () => {
        const port = fallbackServer.address().port;
        fallbackServer.close(() => resolve(port));
      });
    });
  });
}

async function startServer() {
  try {
    logger.info("Initializing PurohitManager storage...");
    await runMigrations();

    const port = await findFreePort(DEFAULT_PORT);
    const app = createApp();
    const server = http.createServer(app);

    server.listen(port, '127.0.0.1', () => {
      const url = `http://127.0.0.1:${port}`;
      console.log(`
========================================================================
  🪔 PUROHIT MANAGER (पुरोहित व्यवस्थापक - ಪುರೋಹಿತ ವ್ಯವಸ್ಥಾಪಕ)
  Status:  Running (Offline-first, 100% Local)
  URL:     ${url}
  Port:    ${port}
========================================================================
`);
      logger.info(`Server listening on ${url}`);

      // Automatically open the user's default web browser
      if (!process.env.NO_BROWSER) {
        const openCmd = process.platform === 'win32'
          ? `start "" "${url}"`
          : process.platform === 'darwin'
          ? `open "${url}"`
          : `xdg-open "${url}"`;
        exec(openCmd, (err) => {
          if (err) {
            logger.warn(`Could not auto-open browser: ${err.message}`);
          }
        });
      }
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

startServer();

