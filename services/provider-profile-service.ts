import { prisma } from '@/lib/prisma';
import type { ProviderProfileInput } from '@/lib/validations/provider-profile';

export async function getProviderProfile(userId: string) {
  return prisma.providerProfile.findUnique({ where: { userId } });
}

export async function saveProviderProfile(userId: string, input: ProviderProfileInput) {
  return prisma.providerProfile.upsert({
    where: { userId },
    create: { ...input, userId },
    update: input,
  });
}