import { z } from 'zod';

export const favoriteServiceIdSchema = z.object({
  serviceListingId: z.string().min(1, 'Service ID is required'),
});

export type FavoriteServiceId = z.infer<typeof favoriteServiceIdSchema>;
