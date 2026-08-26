import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedListing } from '@/services/service-listing-service';

const priceLabels: Record<string, string> = { HOURLY: 'per hour', FIXED: 'fixed price', CUSTOM: 'custom quote' };
const locationLabels: Record<string, string> = { ONSITE: 'On-site', REMOTE: 'Remote', BOTH: 'On-site or remote' };

type ServiceDetailProps = { params: Promise<{ id: string }> };

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  const { id } = await params;
  const service = await getPublishedListing(id);
  if (!service) notFound();

  const provider = service.providerProfile;

  return (
    <main className="py-12">
      <div className="container-shell">
        <Link href="/services" className="text-sm font-semibold text-brand-700 hover:text-brand-800">Back to services</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap gap-2 text-sm font-semibold text-brand-700">
              <span>{service.category.name}</span><span className="text-slate-300">/</span><span>{locationLabels[service.locationType]}</span>
            </div>
            <h1 className="mt-5 text-4xl font-bold text-slate-900">{service.title}</h1>
            <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">{service.description}</p>
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-500">Pricing</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">${service.price.toFixed(2)} <span className="text-sm font-medium text-slate-500">{priceLabels[service.priceType]}</span></p>
            </div>
          </article>
          <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-900 p-7 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-300">Provided by</p>
            <h2 className="mt-4 text-2xl font-bold">{provider.businessName}</h2>
            {provider.tagline ? <p className="mt-2 text-slate-300">{provider.tagline}</p> : null}
            {provider.bio ? <p className="mt-5 leading-7 text-slate-300">{provider.bio}</p> : null}
            {provider.location ? <p className="mt-5 text-sm text-slate-400">{provider.location}</p> : null}
            <Link href={`/providers/${provider.id}`} className="mt-6 inline-flex rounded-xl bg-brand-400 px-4 py-3 font-semibold text-slate-950 hover:bg-brand-300">View provider profile</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
