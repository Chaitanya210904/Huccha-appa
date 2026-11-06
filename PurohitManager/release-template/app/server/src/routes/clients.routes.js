import { Router } from 'express';
import { clientsRepo } from '../repositories/clients.repo.js';
import { familyMembersRepo } from '../repositories/familyMembers.repo.js';
import { deceasedRepo } from '../repositories/deceased.repo.js';
import { bookingsRepo } from '../repositories/bookings.repo.js';
import { validate } from '../middleware/validate.js';
import { ClientSchema, FamilyMemberSchema } from '@purohit-manager/shared';

const router = Router();

// GET all clients
router.get('/', async (req, res, next) => {
  try {
    const clients = await clientsRepo.getAll();
    res.json({ success: true, data: clients });
  } catch (err) {
    next(err);
  }
});

// GET client by ID with family, deceased, and bookings
router.get('/:id', async (req, res, next) => {
  try {
    const client = await clientsRepo.getById(req.params.id);
    if (!client) return res.status(404).json({ success: false, error: "Client not found" });

    const family = await familyMembersRepo.getByClientId(req.params.id);
    const deceased = await deceasedRepo.getByClientId(req.params.id);
    const bookings = await bookingsRepo.getByClientId(req.params.id);

    res.json({
      success: true,
      data: {
        ...client,
        familyMembers: family,
        deceasedAncestors: deceased,
        bookings
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST new client
router.post('/', validate(ClientSchema), async (req, res, next) => {
  try {
    const newClient = await clientsRepo.create(req.body);
    res.status(201).json({ success: true, data: newClient });
  } catch (err) {
    next(err);
  }
});

// PUT update client
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await clientsRepo.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Client not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE client
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await clientsRepo.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Client not found" });
    res.json({ success: true, message: "Client deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// POST family member for client
router.post('/:id/family', validate(FamilyMemberSchema), async (req, res, next) => {
  try {
    const member = await familyMembersRepo.create({
      ...req.body,
      clientId: req.params.id
    });
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
});

export default router;

