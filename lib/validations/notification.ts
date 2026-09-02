import { z } from 'zod';

export const notificationIdSchema = z.object({
  id: z.string().min(1, 'Notification ID is required'),
});

export type NotificationId = z.infer<typeof notificationIdSchema>;
