import { Router } from 'express';
import { pujaSamagriRepo } from '../repositories/pujaSamagri.repo.js';
import { inventoryRepo } from '../repositories/inventory.repo.js';
import fs from 'fs';
import path from 'path';
import { RESOURCES_DIR } from '../config/paths.js';

const router = Router();

// ==========================================
// PUJA SAMAGRI CHECKLIST ROUTES (Primary)
// ==========================================

// GET all Pujas and their Samagri Checklists
router.get('/pujas', async (req, res, next) => {
  try {
    const list = await pujaSamagriRepo.getAll();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// GET specific Puja by ID
router.get('/pujas/:id', async (req, res, next) => {
  try {
    const puja = await pujaSamagriRepo.getById(req.params.id);
    if (!puja) return res.status(404).json({ success: false, error: 'Puja not found' });
    res.json({ success: true, data: puja });
  } catch (err) {
    next(err);
  }
});

// POST create new Puja
router.post('/pujas', async (req, res, next) => {
  try {
    const created = await pujaSamagriRepo.createPuja(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
});

// PUT update Puja details or items
router.put('/pujas/:id', async (req, res, next) => {
  try {
    const updated = await pujaSamagriRepo.updatePuja(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Puja not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE Puja
router.delete('/pujas/:id', async (req, res, next) => {
  try {
    await pujaSamagriRepo.deletePuja(req.params.id);
    res.json({ success: true, message: 'Puja deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// POST add Samagri Item to a Puja
router.post('/pujas/:id/items', async (req, res, next) => {
  try {
    const item = await pujaSamagriRepo.addItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, error: 'Puja not found' });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

// PUT update a Samagri Item in a Puja
router.put('/pujas/:id/items/:itemId', async (req, res, next) => {
  try {
    const updated = await pujaSamagriRepo.updateItem(req.params.id, req.params.itemId, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Item or Puja not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE a Samagri Item from a Puja
router.delete('/pujas/:id/items/:itemId', async (req, res, next) => {
  try {
    const ok = await pujaSamagriRepo.deleteItem(req.params.id, req.params.itemId);
    if (!ok) return res.status(404).json({ success: false, error: 'Item or Puja not found' });
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET samagri template for a specific service (compatible with existing code)
router.get('/templates/:serviceId', async (req, res) => {
  try {
    const puja = await pujaSamagriRepo.getById(req.params.serviceId);
    if (puja) {
      return res.json({ success: true, data: puja });
    }

    const file = path.resolve(RESOURCES_DIR, `templates/samagri/${req.params.serviceId}.json`);
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      return res.json({ success: true, data });
    }

    // Fallback general list
    res.json({
      success: true,
      data: {
        serviceId: req.params.serviceId,
        name: "General Puja Samagri",
        items: [
          { item: "Turmeric & Kumkum", qty: "100g each", kannada: "ಅರಿಶಿನ, ಕುಂಕುಮ", essential: true },
          { item: "Betel leaves & nuts", qty: "20 each", kannada: "ವೀಳ್ಯದೆಲೆ ಅಡಿಕೆ", essential: true },
          { item: "Coconuts", qty: "3 nos", kannada: "ತೆಂಗಿನಕಾಯಿ", essential: true },
          { item: "Raw rice", qty: "1 kg", kannada: "ಅಕ್ಕಿ", essential: true },
          { item: "Flowers & Garland", qty: "1 set", kannada: "ಹೂವು ಮತ್ತು ಹಾರ", essential: true },
          { item: "Fruits (Bananas)", qty: "1 bunch", kannada: "ಹಣ್ಣುಗಳು", essential: true },
          { item: "Camphor & Agarbatti", qty: "1 box", kannada: "ಕರ್ಪೂರ, ಊದಿನಕಡ್ಡಿ", essential: true }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Legacy inventory fallback routes
router.get('/', async (req, res, next) => {
  try {
    const items = await inventoryRepo.getAll();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

export default router;
