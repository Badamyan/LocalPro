import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ProviderListingManager } from '@/components/marketplace/provider-listing-manager';
import { prisma } from '@/lib/prisma';
import { getProviderListings } from '@/services/service-listing-service';

export default async function ProviderServicesPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'PROVIDER') redirect('/dashboard');

  const [categories, listings] = await Promise.all([
    prisma.serviceCategory.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    getProviderListings(session.user.id),
  ]);

  return (
    <main className="py-12">
      <div className="container-shell">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Provider workspace</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Your services</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Create and maintain the services customers can discover on LocalPro.</p>
        <div className="mt-8"><ProviderListingManager categories={categories} initialListings={listings} /></div>
      </div>
    </main>
  );
}
