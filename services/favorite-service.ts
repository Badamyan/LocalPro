import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const favoriteInclude = {
  serviceListing: {
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      priceType: true,
      locationType: true,
      status: true,
      category: { select: { id: true, name: true } },
      providerProfile: { select: { id: true, businessName: true, isVerified: true } },
    },
  },
} satisfies Prisma.FavoriteInclude;

export type FavoriteWithDetails = Prisma.FavoriteGetPayload<{ include: typeof favoriteInclude }>;

export async function addFavorite(userId: string, serviceListingId: string) {
  // Verify the service exists and is published
  const service = await prisma.serviceListing.findUnique({
    where: { id: serviceListingId },
    select: { id: true, status: true },
  });
  if (!service) throw new Error('SERVICE_NOT_FOUND');
  if (service.status !== 'PUBLISHED') throw new Error('SERVICE_NOT_PUBLISHED');

  // Check if favorite already exists
  const existing = await prisma.favorite.findUnique({
    where: { userId_serviceListingId: { userId, serviceListingId } },
  });
  if (existing) throw new Error('FAVORITE_EXISTS');

  return prisma.favorite.create({
    data: { userId, serviceListingId },
    include: favoriteInclude,
  });
}

export async function removeFavorite(userId: string, serviceListingId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_serviceListingId: { userId, serviceListingId } },
  });
  if (!favorite) return null;

  await prisma.favorite.delete({
    where: { id: favorite.id },
  });
  return favorite;
}

export async function getFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: favoriteInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function isFavorite(userId: string, serviceListingId: string) {
  const favorite = await prisma.favorite.findUnique({
    where: { userId_serviceListingId: { userId, serviceListingId } },
  });
  return Boolean(favorite);
}
