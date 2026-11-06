import { z } from 'zod';

export const BookingSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().min(1, "Client is required"),
  clientName: z.string().optional(),
  serviceId: z.string().min(1, "Service type is required"),
  serviceName: z.string().min(1, "Service name is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  dakshina: z.number().min(0, "Dakshina amount must be positive").default(0),
  paidAmount: z.number().min(0).default(0),
  status: z.enum(['inquiry', 'confirmed', 'scheduled', 'completed', 'cancelled']).default('scheduled'),
  assistantIds: z.array(z.string()).default([]),
  notes: z.string().optional().default(''),
  samagriChecklist: z.array(z.object({
    item: z.string(),
    qty: z.string().optional(),
    provided: z.boolean().default(false)
  })).optional().default([]),
  createdAt: z.string().optional()
});

