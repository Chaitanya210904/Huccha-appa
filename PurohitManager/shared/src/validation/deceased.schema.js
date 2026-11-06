import { z } from 'zod';

export const DeceasedSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().min(1, "Client must be selected"),
  clientName: z.string().optional(),
  name: z.string().min(2, "Ancestor name is required"),
  relation: z.string().min(2, "Relation is required (e.g. Pitru, Matru, Pitamaha)"),
  gotra: z.string().min(2, "Gotra is required"),
  deathDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Death date must be YYYY-MM-DD"),
  deathTime: z.string().optional().default('12:00'),
  deathPlace: z.string().optional().default(''),
  // Vedic death details (can be auto-calculated or manually adjusted)
  masa: z.string().min(1, "Masa is required"),
  paksha: z.enum(['Shukla', 'Krishna']),
  tithi: z.number().int().min(1).max(30),
  tithiName: z.string().optional(),
  nakshatra: z.string().optional(),
  sampradaya: z.enum(['Smartha', 'Madhva', 'Vaishnava', 'Other']).default('Smartha'),
  notes: z.string().optional().default(''),
  createdAt: z.string().optional()
});

