import { Router } from 'express';
import { reportsService } from '../services/reports.service.js';

const router = Router();

// GET financial summary
router.get('/finance', async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const summary = await reportsService.getFinancialSummary(year);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

export default router;

