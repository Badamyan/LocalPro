import { z } from 'zod';

export const bookingCreateSchema = z.object({
  serviceListingId: z.string().min(1, 'Service is required'),
  scheduledDate: z.coerce.date().refine((date) => date.getTime() > Date.now(), 'Scheduled date must be in the future'),
  durationMinutes: z.coerce.number().int().positive().max(1440).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED']),
});

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type BookingUpdateInput = z.infer<typeof bookingUpdateSchema>;