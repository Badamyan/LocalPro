import Link from 'next/link';
import { ServiceCard } from '@/components/marketplace/service-card';
import { prisma } from '@/lib/prisma';
import { getPublishedListings } from '@/services/service-listing-service';

type ServicesPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    priceType?: string;
    locationType?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    sort?: string;
  }>;
};

const priceTypes = ['HOURLY', 'FIXED', 'CUSTOM'] as const;
const locationTypes = ['ONSITE', 'REMOTE', 'BOTH'] as const;
const sortOptions = ['newest', 'price_asc', 'price_desc', 'rating'] as const;
const ratingOptions = ['1', '2', '3', '4', '5'] as const;

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const [services, categories] = await Promise.all([
    getPublishedListings({
      q: params.q,
      category: params.category,
      priceType: priceTypes.includes(params.priceType as (typeof priceTypes)[number]) ? (params.priceType as (typeof priceTypes)[number]) : undefined,
      locationType: locationTypes.includes(params.locationType as (typeof locationTypes)[number]) ? (params.locationType as (typeof locationTypes)[number]) : undefined,
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      minRating: params.minRating ? parseFloat(params.minRating) : undefined,
      sort: sortOptions.includes(params.sort as (typeof sortOptions)[number]) ? (params.sort as (typeof sortOptions)[number]) : undefined,
    }),
    prisma.serviceCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  // Build query string for clear filters
  const hasActiveFilters =
    params.q || params.category || params.priceType || params.locationType || params.minPrice || params.maxPrice || params.minRating || params.sort;

  // Build display of active filters
  const activeFilters = [];
  if (params.q) activeFilters.push(`Search: "${params.q}"`);
  if (params.category) {
    const cat = categories.find((c) => c.slug === params.category);
    if (cat) activeFilters.push(`Category: ${cat.name}`);
  }
  if (params.priceType) {
    const labels: Record<string, string> = { HOURLY: 'Hourly', FIXED: 'Fixed price', CUSTOM: 'Custom quote' };
    activeFilters.push(`Price type: ${labels[params.priceType]}`);
  }
  if (params.locationType) {
    const labels: Record<string, string> = { ONSITE: 'On-site', REMOTE: 'Remote', BOTH: 'On-site or remote' };
    activeFilters.push(`Location: ${labels[params.locationType]}`);
  }
  if (params.minPrice) activeFilters.push(`Min price: $${params.minPrice}`);
  if (params.maxPrice) activeFilters.push(`Max price: $${params.maxPrice}`);
  if (params.minRating) activeFilters.push(`Min rating: ${params.minRating}+ stars`);
  if (params.sort) {
    const labels: Record<string, string> = { newest: 'Newest', price_asc: 'Price: Low to High', price_desc: 'Price: High to Low', rating: 'Highest Rated' };
    activeFilters.push(`Sort: ${labels[params.sort]}`);
  }

  return (
    <main className="py-12">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">LocalPro marketplace</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">Services near you</h1>
            <p className="mt-3 text-slate-600">Search published services from local professionals.</p>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Browse categories
          </Link>
        </div>

        <form className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Search and basic filters */}
          <div className="grid gap-3 md:grid-cols-5">
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search services or providers"
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 md:col-span-2"
            />
            <select name="category" defaultValue={params.category || ''} className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500">
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
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
          </div>

          {/* Price range and rating filters */}
          <div className="grid gap-3 md:grid-cols-5">
            <input
              type="number"
              name="minPrice"
              defaultValue={params.minPrice}
              placeholder="Min price"
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              name="maxPrice"
              defaultValue={params.maxPrice}
              placeholder="Max price"
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500"
              min="0"
              step="0.01"
            />
            <select name="minRating" defaultValue={params.minRating || ''} className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500">
              <option value="">Any rating</option>
              <option value="5">5+ stars</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
              <option value="1">1+ stars</option>
            </select>
            <select name="sort" defaultValue={params.sort || ''} className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-500">
              <option value="">Sort by (default)</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
              Search
            </button>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Link href="/services" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                Clear all filters
              </Link>
            </div>
          )}
        </form>

        {/* Active filters display */}
        {activeFilters.length > 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Active filters:</p>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-slate-700 border border-slate-200">
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {services.length} published {services.length === 1 ? 'service' : 'services'}
          </p>
        </div>

        {/* Service grid */}
        <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Empty state */}
        {services.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-600 font-medium">No published services match those filters.</p>
            {hasActiveFilters && (
              <Link href="/services" className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800">
                Clear filters and try again
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
