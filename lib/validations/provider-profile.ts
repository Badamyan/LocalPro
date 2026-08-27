import { z } from 'zod';

export const providerProfileSchema = z.object({
  businessName: z.string().trim().min(2, 'Business name is required').max(120),
  tagline: z.string().trim().max(160).optional().nullable(),
  bio: z.string().trim().max(2000).optional().nullable(),
  location: z.string().trim().max(160).optional().nullable(),
  city: z.string().trim().max(80).optional().nullable(),
  state: z.string().trim().max(80).optional().nullable(),
  country: z.string().trim().max(80).optional().nullable(),
  hourlyRate: z.coerce.number().nonnegative('Hourly rate cannot be negative').optional().nullable(),
  responseTimeHours: z.coerce.number().int().positive().max(8760).optional().nullable(),
});

export type ProviderProfileInput = z.infer<typeof providerProfileSchema>;