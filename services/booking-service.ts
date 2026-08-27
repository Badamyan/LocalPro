import { BookingStatus, PriceType, Prisma, Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { BookingCreateInput, BookingUpdateInput } from '@/lib/validations/booking';

const bookingInclude = {
  customer: { select: { id: true, name: true } },
  providerProfile: { select: { id: true, businessName: true } },
  serviceListing: { select: { id: true, title: true, price: true, priceType: true } },
  review: { select: { id: true, rating: true, comment: true } },
} satisfies Prisma.BookingInclude;

export type BookingWithDetails = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>;

function accessWhere(userId: string, role: Role) {
  return role === Role.PROVIDER
    ? { providerProfile: { userId } }
    : { customerId: userId };
}

function calculateTotalPrice(price: number, priceType: PriceType, durationMinutes: number | null | undefined) {
  if (priceType === PriceType.CUSTOM) return null;
  if (priceType === PriceType.HOURLY) {
    if (!durationMinutes) throw new Error('DURATION_REQUIRED');
    return Number((price * durationMinutes / 60).toFixed(2));
  }
  return price;
}

export async function getBookings(userId: string, role: Role) {
  return prisma.booking.findMany({
    where: accessWhere(userId, role),
    include: bookingInclude,
    orderBy: [{ scheduledDate: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getBooking(userId: string, role: Role, id: string) {
  return prisma.booking.findFirst({ where: { id, ...accessWhere(userId, role) }, include: bookingInclude });
}

export async function createBooking(customerId: string, input: BookingCreateInput) {
  const service = await prisma.serviceListing.findFirst({
    where: { id: input.serviceListingId, status: 'PUBLISHED' },
    select: { id: true, title: true, price: true, priceType: true, providerProfileId: true, providerProfile: { select: { userId: true } } },
  });
  if (!service) throw new Error('SERVICE_NOT_FOUND');

  const totalPrice = calculateTotalPrice(service.price, service.priceType, input.durationMinutes);
  return prisma.$transaction(async (transaction) => {
    const booking = await transaction.booking.create({
      data: {
        customerId,
        providerProfileId: service.providerProfileId,
        serviceListingId: service.id,
        scheduledDate: input.scheduledDate,
        durationMinutes: input.durationMinutes ?? null,
        notes: input.notes || null,
        totalPrice,
      },
      include: bookingInclude,
    });
    await transaction.notification.create({
      data: {
        userId: service.providerProfile.userId,
        type: 'BOOKING_REQUEST',
        message: `New booking request for ${service.title}.`,
        relatedEntityType: 'BOOKING',
        relatedEntityId: booking.id,
      },
    });
    return booking;
  });
}

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  PENDING: [BookingStatus.ACCEPTED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
  ACCEPTED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
};

export async function updateBooking(userId: string, role: Role, id: string, input: BookingUpdateInput) {
  const existing = await prisma.booking.findFirst({ where: { id, ...accessWhere(userId, role) }, include: bookingInclude });
  if (!existing) return null;

  const nextStatus = input.status as BookingStatus;
  const providerStatuses: BookingStatus[] = [BookingStatus.ACCEPTED, BookingStatus.REJECTED, BookingStatus.COMPLETED];
  const isProviderAction = role === Role.PROVIDER && providerStatuses.includes(nextStatus);
  const isCustomerAction = role === Role.CUSTOMER && nextStatus === BookingStatus.CANCELLED;
  if ((!isProviderAction && !isCustomerAction) || !allowedTransitions[existing.status].includes(nextStatus)) {
    throw new Error('INVALID_TRANSITION');
  }

  const updated = await prisma.$transaction(async (transaction) => {
    const booking = await transaction.booking.update({ where: { id }, data: { status: nextStatus }, include: bookingInclude });
    const recipientId = role === Role.PROVIDER
      ? booking.customerId
      : (await transaction.providerProfile.findUniqueOrThrow({ where: { id: booking.providerProfileId }, select: { userId: true } })).userId;
    await transaction.notification.create({
      data: {
        userId: recipientId,
        type: `BOOKING_${nextStatus}`,
        message: `Your booking for ${booking.serviceListing.title} is now ${nextStatus.toLowerCase()}.`,
        relatedEntityType: 'BOOKING',
        relatedEntityId: booking.id,
      },
    });
    return booking;
  });
  return updated;
}

export async function cancelBooking(userId: string, id: string) {
  return updateBooking(userId, Role.CUSTOMER, id, { status: 'CANCELLED' });
}