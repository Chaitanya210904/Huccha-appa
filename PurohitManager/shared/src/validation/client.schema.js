import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Valid phone number required"),
  alternatePhone: z.string().optional().default(''),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  address: z.string().optional().default(''),
  gotra: z.string().min(2, "Gotra is required"),
  nakshatra: z.string().optional().default(''),
  rashi: z.string().optional().default(''),
  community: z.enum(['Smartha', 'Madhva', 'Vaishnava', 'Other']).default('Smartha'),
  notes: z.string().optional().default(''),
  createdAt: z.string().optional()
});

export const FamilyMemberSchema = z.object({
  id: z.string().optional(),
  clientId: z.string(),
  name: z.string().min(2),
  relation: z.string().min(2), // e.g. 'Wife', 'Son', 'Daughter'
  gotra: z.string().optional(),
  nakshatra: z.string().optional(),
  rashi: z.string().optional(),
  dateOfBirth: z.string().optional()
});

