import { Router } from 'express';
import { settingsRepo } from '../repositories/settings.repo.js';
import { assistantsRepo } from '../repositories/assistants.repo.js';
import { servicesRepo } from '../repositories/services.repo.js';
import { clientsRepo } from '../repositories/clients.repo.js';
import { deceasedRepo } from '../repositories/deceased.repo.js';
import { bookingsRepo } from '../repositories/bookings.repo.js';
import { paymentsRepo } from '../repositories/payments.repo.js';
import { expensesRepo } from '../repositories/expenses.repo.js';
import { inventoryRepo } from '../repositories/inventory.repo.js';
import { cache } from '../storage/cache.js';
import fs from 'fs';
import path from 'path';
import { RESOURCES_DIR, ENTITY_FILES } from '../config/paths.js';
import { jsonStore } from '../storage/jsonStore.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    app: 'PurohitManager',
    offline: true,
    time: new Date().toISOString()
  });
});

// GET settings
router.get('/settings', async (req, res, next) => {
  try {
    const settings = await settingsRepo.get();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

// PUT update settings
router.put('/settings', async (req, res, next) => {
  try {
    const updated = await settingsRepo.update(req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// GET assistants
router.get('/assistants', async (req, res, next) => {
  try {
    const list = await assistantsRepo.getAll();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// POST new assistant
router.post('/assistants', async (req, res, next) => {
  try {
    const item = await assistantsRepo.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

// PUT update assistant
router.put('/assistants/:id', async (req, res, next) => {
  try {
    const updated = await assistantsRepo.update(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE assistant
router.delete('/assistants/:id', async (req, res, next) => {
  try {
    await assistantsRepo.delete(req.params.id);
    res.json({ success: true, message: "Assistant deleted" });
  } catch (err) {
    next(err);
  }
});

// GET services
router.get('/services', async (req, res, next) => {
  try {
    const list = await servicesRepo.getAll();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// POST seed demo data
router.post('/seed-demo', async (req, res, next) => {
  try {
    const demoFile = path.resolve(RESOURCES_DIR, 'demoData/sampleData.json');
    if (!fs.existsSync(demoFile)) {
      return res.status(404).json({ success: false, error: "Demo data file not found" });
    }

    const demoData = JSON.parse(fs.readFileSync(demoFile, 'utf8'));

    if (demoData.settings) await jsonStore.write(ENTITY_FILES.settings, demoData.settings);
    if (demoData.clients) await jsonStore.write(ENTITY_FILES.clients, demoData.clients);
    if (demoData.deceased) await jsonStore.write(ENTITY_FILES.deceased, demoData.deceased);
    if (demoData.bookings) await jsonStore.write(ENTITY_FILES.bookings, demoData.bookings);
    if (demoData.services) await jsonStore.write(ENTITY_FILES.services, demoData.services);
    if (demoData.assistants) await jsonStore.write(ENTITY_FILES.assistants, demoData.assistants);
    if (demoData.payments) await jsonStore.write(ENTITY_FILES.payments, demoData.payments);
    if (demoData.expenses) await jsonStore.write(ENTITY_FILES.expenses, demoData.expenses);
    if (demoData.inventory) await jsonStore.write(ENTITY_FILES.inventory, demoData.inventory);

    cache.clear();
    logger.info("Demo data loaded successfully.");
    res.json({ success: true, message: "Sample demo data loaded successfully!" });
  } catch (err) {
    next(err);
  }
});

// POST quit application
router.post('/quit', (req, res) => {
  res.json({ success: true, message: "Shutting down PurohitManager..." });
  setTimeout(() => {
    process.exit(0);
  }, 500);
});

export default router;

