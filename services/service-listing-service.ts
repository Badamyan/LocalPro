import { ListingStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ServiceListingInput } from '@/lib/validations/service';

export const publicListingInclude = {
  category: true,
  providerProfile: {
    select: {
      id: true,
      businessName: true,
      tagline: true,
      bio: true,
      location: true,
      city: true,
      state: true,
      country: true,
      hourlyRate: true,
      isVerified: true,
    },
  },
} satisfies Prisma.ServiceListingInclude;

type ServiceWithRating = Prisma.ServiceListingGetPayload<{
  include: typeof publicListingInclude;
}> & { averageRating?: number; reviewCount?: number };

export async function getPublishedListings(filters: {
  q?: string;
  category?: string;
  priceType?: 'HOURLY' | 'FIXED' | 'CUSTOM';
  locationType?: 'ONSITE' | 'REMOTE' | 'BOTH';
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
}) {
  const search = filters.q
    ? {
        OR: [
          { title: { contains: filters.q, mode: 'insensitive' as const } },
          { description: { contains: filters.q, mode: 'insensitive' as const } },
          {
            providerProfile: {
              businessName: { contains: filters.q, mode: 'insensitive' as const },
            },
          },
        ],
      }
    : {};

  // Base query with filters
  let services = await prisma.serviceListing.findMany({
    where: {
      status: ListingStatus.PUBLISHED,
      ...search,
      ...(filters.category
        ? { category: { slug: filters.category } }
        : {}),
      ...(filters.priceType ? { priceType: filters.priceType } : {}),
      ...(filters.locationType ? { locationType: filters.locationType } : {}),
      ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
        ? {
            AND: [
              filters.minPrice !== undefined ? { price: { gte: filters.minPrice } } : {},
              filters.maxPrice !== undefined ? { price: { lte: filters.maxPrice } } : {},
            ].filter((x) => Object.keys(x).length > 0),
          }
        : {}),
    },
    include: publicListingInclude,
  });

  // If we need rating filtering or rating-based sorting, fetch reviews
  if (filters.minRating || filters.sort === 'rating') {
    const serviceIds = services.map((s) => s.id);
    if (serviceIds.length > 0) {
      const reviews = await prisma.review.groupBy({
        by: ['serviceListingId'],
        where: { serviceListingId: { in: serviceIds } },
        _avg: { rating: true },
        _count: { id: true },
      });

      const reviewMap = new Map(
        reviews.map((r) => [r.serviceListingId, { avg: r._avg.rating ?? 0, count: r._count.id }]),
      );

      // Add ratings to services
      const servicesWithRatings: ServiceWithRating[] = services.map((s) => ({
        ...s,
        averageRating: reviewMap.get(s.id)?.avg ?? 0,
        reviewCount: reviewMap.get(s.id)?.count ?? 0,
      }));

      // Filter by minimum rating
      const minRating = filters.minRating;
      if (minRating !== undefined && minRating > 0) {
        services = servicesWithRatings.filter((s) => (s.averageRating ?? 0) >= minRating) as any;
      } else {
        services = servicesWithRatings as any;
      }
    }
  }

  // Apply sorting
  if (filters.sort === 'price_asc') {
    services.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    services.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'rating') {
    const servicesWithRatings = services as ServiceWithRating[];
    servicesWithRatings.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
  } else {
    // newest (default)
    services.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return services;
}

export async function getPublishedListing(id: string) {
  return prisma.serviceListing.findFirst({
    where: { id, status: ListingStatus.PUBLISHED },
    include: publicListingInclude,
  });
}

export async function getProviderListings(userId: string) {
  return prisma.serviceListing.findMany({
    where: { providerProfile: { userId } },
    include: { category: true },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function createProviderListing(userId: string, input: ServiceListingInput) {
  const providerProfile = await prisma.providerProfile.findUnique({ where: { userId } });

  if (!providerProfile) {
    throw new Error('PROVIDER_PROFILE_REQUIRED');
  }

  return prisma.serviceListing.create({
    data: { ...input, providerProfileId: providerProfile.id },
    include: { category: true },
  });
}

export async function updateProviderListing(
  userId: string,
  id: string,
  input: ServiceListingInput,
) {
  const listing = await prisma.serviceListing.findFirst({
    where: { id, providerProfile: { userId } },
  });

  if (!listing) {
    return null;
  }

  return prisma.serviceListing.update({
    where: { id },
    data: input,
    include: { category: true },
  });
}

export async function deleteProviderListing(userId: string, id: string) {
  const listing = await prisma.serviceListing.findFirst({
    where: { id, providerProfile: { userId } },
    select: { id: true },
  });

  if (!listing) {
    return null;
  }

  await prisma.serviceListing.delete({ where: { id } });
  return listing;
}
