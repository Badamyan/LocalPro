import { z } from 'zod';

export const reviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking is required'),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000, 'Comment must be 2000 characters or fewer').optional().nullable(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
