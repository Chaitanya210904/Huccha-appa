import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { localOnly } from './middleware/localOnly.js';
import { errorHandler } from './middleware/errorHandler.js';

import clientsRoutes from './routes/clients.routes.js';
import deceasedRoutes from './routes/deceased.routes.js';
import shraddhaRoutes from './routes/shraddha.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import panchangRoutes from './routes/panchang.routes.js';
import financeRoutes from './routes/finance.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import backupRoutes from './routes/backup.routes.js';
import authRoutes from './routes/auth.routes.js';
import systemRoutes from './routes/system.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  // Offline security: only allow local connections
  app.use(localOnly);

  // Enable CORS for development
  app.use(cors({ origin: true, credentials: true }));

  // Parsers (support large PDF calendar uploads)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Mount API Routes
  app.use('/api/clients', clientsRoutes);
  app.use('/api/deceased', deceasedRoutes);
  app.use('/api/shraddha', shraddhaRoutes);
  app.use('/api/bookings', bookingsRoutes);
  app.use('/api/panchang', panchangRoutes);
  app.use('/api/finance', financeRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/backup', backupRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/system', systemRoutes);

  // Serve production client build if exists
  const clientDist = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res, next) => {
      if (req.url.startsWith('/api')) return next();
      res.sendFile(path.resolve(clientDist, 'index.html'));
    });
  }

  // Centralized friendly error handler
  app.use(errorHandler);

  return app;
}

