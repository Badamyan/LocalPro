import { z } from 'zod';

export const serviceListingSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').max(2000),
  price: z.coerce.number().nonnegative('Price cannot be negative'),
  priceType: z.enum(['HOURLY', 'FIXED', 'CUSTOM']),
  durationMinutes: z.coerce.number().int().positive().optional().nullable(),
  locationType: z.enum(['ONSITE', 'REMOTE', 'BOTH']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'PAUSED', 'ARCHIVED']).default('DRAFT'),
});

export const serviceQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().optional(),
  priceType: z.enum(['HOURLY', 'FIXED', 'CUSTOM']).optional(),
  locationType: z.enum(['ONSITE', 'REMOTE', 'BOTH']).optional(),
});

export type ServiceListingInput = z.infer<typeof serviceListingSchema>;
