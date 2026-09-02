import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const notificationInclude = {
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.NotificationInclude;

export type NotificationWithDetails = Prisma.NotificationGetPayload<{ include: typeof notificationInclude }>;

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    include: notificationInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getNotification(userId: string, notificationId: string) {
  return prisma.notification.findFirst({
    where: { id: notificationId, userId },
    include: notificationInclude,
  });
}

export async function markAsRead(userId: string, notificationId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!notification) return null;

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
    include: notificationInclude,
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}
