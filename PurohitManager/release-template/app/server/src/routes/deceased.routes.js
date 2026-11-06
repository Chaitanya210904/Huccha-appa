import { Router } from 'express';
import { deceasedRepo } from '../repositories/deceased.repo.js';
import { settingsRepo } from '../repositories/settings.repo.js';
import { validate } from '../middleware/validate.js';
import { DeceasedSchema, calculateDeathDetails } from '@purohit-manager/shared';

const router = Router();

// GET all deceased
router.get('/', async (req, res, next) => {
  try {
    const list = await deceasedRepo.getAll();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// GET deceased by ID
router.get('/:id', async (req, res, next) => {
  try {
    const item = await deceasedRepo.getById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: "Record not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

// POST calculate Vedic death details from Gregorian death date & time
router.post('/calculate-details', async (req, res, next) => {
  try {
    const { deathDate, deathTime } = req.body;
    if (!deathDate) return res.status(400).json({ success: false, error: "deathDate is required" });

    const settings = await settingsRepo.get();
    const place = { lat: settings.latitude, lon: settings.longitude, name: settings.cityName };

    const details = calculateDeathDetails(deathDate, deathTime || '12:00', place, {
      ayanamsa: settings.ayanamsa,
      masaSystem: settings.calendarSystem
    });

    res.json({ success: true, data: details });
  } catch (err) {
    next(err);
  }
});

// POST new deceased record
router.post('/', validate(DeceasedSchema), async (req, res, next) => {
  try {
    const newItem = await deceasedRepo.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    next(err);
  }
});

// PUT update deceased record
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await deceasedRepo.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Record not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE deceased record
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deceasedRepo.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Record not found" });
    res.json({ success: true, message: "Record deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;

