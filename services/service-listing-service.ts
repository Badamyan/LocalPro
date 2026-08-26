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

export async function getPublishedListings(filters: {
  q?: string;
  category?: string;
  priceType?: 'HOURLY' | 'FIXED' | 'CUSTOM';
  locationType?: 'ONSITE' | 'REMOTE' | 'BOTH';
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

  return prisma.serviceListing.findMany({
    where: {
      status: ListingStatus.PUBLISHED,
      ...search,
      ...(filters.category
        ? { category: { slug: filters.category } }
        : {}),
      ...(filters.priceType ? { priceType: filters.priceType } : {}),
      ...(filters.locationType ? { locationType: filters.locationType } : {}),
    },
    include: publicListingInclude,
    orderBy: { createdAt: 'desc' },
  });
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
