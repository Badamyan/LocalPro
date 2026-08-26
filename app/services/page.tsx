import Link from 'next/link';
import { ServiceCard } from '@/components/marketplace/service-card';
import { prisma } from '@/lib/prisma';
import { getPublishedListings } from '@/services/service-listing-service';

type ServicesPageProps = {
  searchParams: Promise<{ q?: string; category?: string; priceType?: string; locationType?: string }>;
};

const priceTypes = ['HOURLY', 'FIXED', 'CUSTOM'] as const;
const locationTypes = ['ONSITE', 'REMOTE', 'BOTH'] as const;

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const [services, categories] = await Promise.all([
    getPublishedListings({
      q: params.q,
      category: params.category,
      priceType: priceTypes.includes(params.priceType as (typeof priceTypes)[number]) ? params.priceType as (typeof priceTypes)[number] : undefined,
      locationType: locationTypes.includes(params.locationType as (typeof locationTypes)[number]) ? params.locationType as (typeof locationTypes)[number] : undefined,
    }),
    prisma.serviceCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.category) query.set('category', params.category);

  return (
    <main className="py-12">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">LocalPro marketplace</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">Services near you</h1>
            <p className="mt-3 text-slate-600">Search published services from local professionals.</p>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-brand-700 hover:text-brand-800">Browse categories</Link>
        </div>

        <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5" method="get">
          <input name="q" defaultValue={params.q} placeholder="Search services or providers" className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 md:col-span-2" />
          <select name="category" defaultValue={params.category || ''} className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500">
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
          </select>
          <select name="priceType" defaultValue={params.priceType || ''} className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500">
            <option value="">Any price type</option>
            <option value="HOURLY">Hourly</option>
            <option value="FIXED">Fixed price</option>
            <option value="CUSTOM">Custom quote</option>
          </select>
          <select name="locationType" defaultValue={params.locationType || ''} className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500">
            <option value="">Any location</option>
            <option value="ONSITE">On-site</option>
            <option value="REMOTE">Remote</option>
            <option value="BOTH">On-site or remote</option>
          </select>
          <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 md:col-span-5 md:justify-self-end">Search services</button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-600">{services.length} published {services.length === 1 ? 'service' : 'services'}</p>
          {query.size > 0 ? <Link href="/services" className="text-sm font-semibold text-brand-700">Clear filters</Link> : null}
        </div>
        <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
        {services.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">No published services match those filters.</div> : null}
      </div>
    </main>
  );
}
