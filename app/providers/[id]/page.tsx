import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ServiceCard } from '@/components/marketplace/service-card';
import { ReviewList } from '@/components/marketplace/review-list';
import { getProviderReviewSummary, getReviews } from '@/services/review-service';

 type ProviderPageProps = { params: Promise<{ id: string }> };

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { id } = await params;
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      services: {
        where: { status: 'PUBLISHED' },
        include: { category: true, providerProfile: { select: { id: true, businessName: true, isVerified: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!provider) notFound();
  const [summary, reviews] = await Promise.all([getProviderReviewSummary(provider.id), getReviews({ providerProfileId: provider.id })]);

  return (
    <main className="py-12">
      <div className="container-shell">
        <Link href="/services" className="text-sm font-semibold text-brand-700 hover:text-brand-800">Back to services</Link>
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold text-slate-900">{provider.businessName}</h1>
                {provider.isVerified ? <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">Verified provider</span> : null}
              </div>
              {provider.tagline ? <p className="mt-3 text-lg text-slate-600">{provider.tagline}</p> : null}
            </div>
            {provider.hourlyRate !== null ? <div className="rounded-2xl bg-slate-50 px-5 py-4"><p className="text-xs uppercase tracking-wide text-slate-500">Typical hourly rate</p><p className="mt-1 text-2xl font-bold text-slate-900">${provider.hourlyRate.toFixed(2)}</p></div> : null}
          </div>
          {provider.bio ? <p className="mt-7 max-w-3xl leading-8 text-slate-600">{provider.bio}</p> : null}
          {provider.location ? <p className="mt-5 text-sm font-medium text-slate-500">Serving {provider.location}</p> : null}
          <div className="mt-6 border-t border-slate-100 pt-5"><p className="text-2xl font-bold text-slate-900"><span className="text-amber-500">★</span> {summary.averageRating.toFixed(1)}</p><p className="text-sm text-slate-500">{summary.reviewCount} review{summary.reviewCount === 1 ? '' : 's'}</p></div>
        </section>
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><h2 className="text-2xl font-bold text-slate-900">Customer reviews</h2><ReviewList reviews={reviews} /></section>
        <div className="mt-10 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Published services</p><h2 className="mt-2 text-3xl font-bold text-slate-900">What they offer</h2></div><span className="text-sm text-slate-500">{provider.services.length} services</span></div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {provider.services.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
        {provider.services.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">This provider has no published services yet.</div> : null}
      </div>
    </main>
  );
}
