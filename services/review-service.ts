import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ReviewInput } from '@/lib/validations/review';

const reviewInclude = {
  customer: { select: { id: true, name: true } },
  serviceListing: { select: { id: true, title: true } },
  providerProfile: { select: { id: true, businessName: true } },
} satisfies Prisma.ReviewInclude;

export type ReviewWithDetails = Prisma.ReviewGetPayload<{ include: typeof reviewInclude }>;

export async function createReview(customerId: string, input: ReviewInput) {
  const booking = await prisma.booking.findFirst({
    where: { id: input.bookingId, customerId },
    select: { id: true, status: true, providerProfileId: true, serviceListingId: true, review: { select: { id: true } } },
  });

  if (!booking) throw new Error('BOOKING_NOT_FOUND');
  if (booking.status !== 'COMPLETED') throw new Error('BOOKING_NOT_COMPLETED');
  if (booking.review) throw new Error('REVIEW_EXISTS');

  try {
    return await prisma.review.create({
      data: {
        bookingId: booking.id,
        customerId,
        providerProfileId: booking.providerProfileId,
        serviceListingId: booking.serviceListingId,
        rating: input.rating,
        comment: input.comment || null,
      },
      include: reviewInclude,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('REVIEW_EXISTS');
    }
    throw error;
  }
}

export async function getReviews(filters: { providerProfileId?: string; serviceListingId?: string }) {
  return prisma.review.findMany({
    where: {
      ...(filters.providerProfileId ? { providerProfileId: filters.providerProfileId } : {}),
      ...(filters.serviceListingId ? { serviceListingId: filters.serviceListingId } : {}),
    },
    include: reviewInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProviderReviewSummary(providerProfileId: string) {
  return getReviewSummary({ providerProfileId });
}

export async function getServiceReviewSummary(serviceListingId: string) {
  return getReviewSummary({ serviceListingId });
}

async function getReviewSummary(filters: { providerProfileId?: string; serviceListingId?: string }) {
  const [aggregate, count] = await Promise.all([
    prisma.review.aggregate({ where: filters, _avg: { rating: true } }),
    prisma.review.count({ where: filters }),
  ]);

  return { averageRating: aggregate._avg.rating ?? 0, reviewCount: count };
}

export async function getCustomerReviewStatus(customerId: string, bookingId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
    select: { id: true, status: true, review: { select: { id: true } } },
  });
  if (!booking) return null;
  return { bookingId: booking.id, eligible: booking.status === 'COMPLETED' && !booking.review, reviewed: Boolean(booking.review) };
}
