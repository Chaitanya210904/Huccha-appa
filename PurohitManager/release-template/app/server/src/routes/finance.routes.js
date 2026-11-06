import { Router } from 'express';
import { paymentsRepo } from '../repositories/payments.repo.js';
import { expensesRepo } from '../repositories/expenses.repo.js';
import { bookingsRepo } from '../repositories/bookings.repo.js';
import { receiptsService } from '../services/receipts.service.js';
import { validate } from '../middleware/validate.js';
import { PaymentSchema, ExpenseSchema } from '@purohit-manager/shared';

const router = Router();

// GET all payments
router.get('/payments', async (req, res, next) => {
  try {
    const list = await paymentsRepo.getAll();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// POST new payment (and auto update booking paidAmount)
router.post('/payments', validate(PaymentSchema), async (req, res, next) => {
  try {
    const payment = await paymentsRepo.create(req.body);

    if (payment.bookingId) {
      const booking = await bookingsRepo.getById(payment.bookingId);
      if (booking) {
        const newPaid = (Number(booking.paidAmount) || 0) + Number(payment.amount);
        const newStatus = newPaid >= booking.dakshina ? 'completed' : booking.status;
        await bookingsRepo.update(booking.id, { paidAmount: newPaid, status: newStatus });
      }
    }

    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
});

// GET all expenses
router.get('/expenses', async (req, res, next) => {
  try {
    const list = await expensesRepo.getAll();
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
});

// POST new expense
router.post('/expenses', validate(ExpenseSchema), async (req, res, next) => {
  try {
    const expense = await expensesRepo.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
});

// DELETE expense
router.delete('/expenses/:id', async (req, res, next) => {
  try {
    await expensesRepo.delete(req.params.id);
    res.json({ success: true, message: "Expense deleted" });
  } catch (err) {
    next(err);
  }
});

// GET receipt details by payment ID
router.get('/receipt/:paymentId', async (req, res, next) => {
  try {
    const receipt = await receiptsService.getReceiptDetails(req.params.paymentId);
    if (!receipt) return res.status(404).json({ success: false, error: "Payment not found" });
    res.json({ success: true, data: receipt });
  } catch (err) {
    next(err);
  }
});

// GET combined ledger
router.get('/ledger', async (req, res, next) => {
  try {
    const payments = await paymentsRepo.getAll();
    const expenses = await expensesRepo.getAll();

    const items = [
      ...payments.map(p => ({
        id: p.id,
        type: 'INCOME',
        title: `Dakshina from ${p.clientName || 'Client'}`,
        amount: Number(p.amount),
        date: p.date,
        mode: p.mode,
        receiptNumber: p.receiptNumber,
        notes: p.notes
      })),
      ...expenses.map(e => ({
        id: e.id,
        type: 'EXPENSE',
        title: e.title,
        amount: Number(e.amount),
        date: e.date,
        mode: e.paymentMode,
        category: e.category,
        notes: e.notes
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

export default router;

