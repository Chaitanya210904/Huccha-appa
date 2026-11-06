import { z } from 'zod';

export const PaymentSchema = z.object({
  id: z.string().optional(),
  bookingId: z.string().optional(),
  clientId: z.string().min(1, "Client is required"),
  clientName: z.string().optional(),
  amount: z.number().positive("Amount must be greater than zero"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  mode: z.enum(['Cash', 'UPI', 'Bank Transfer', 'Cheque']).default('Cash'),
  receiptNumber: z.string().optional(),
  notes: z.string().optional().default(''),
  createdAt: z.string().optional()
});

export const ExpenseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Expense title is required"),
  category: z.enum(['Samagri', 'Assistant Remuneration', 'Travel', 'Temple/Trust', 'Books/Panchanga', 'Other']).default('Samagri'),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  paymentMode: z.enum(['Cash', 'UPI', 'Bank Transfer']).default('Cash'),
  bookingId: z.string().optional(),
  notes: z.string().optional().default('')
});

