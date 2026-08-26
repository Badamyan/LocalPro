import Link from 'next/link';

type CategoryCardProps = {
  name: string;
  slug: string;
  description: string | null;
  serviceCount?: number;
};

export function CategoryCard({ name, slug, description, serviceCount = 0 }: CategoryCardProps) {
  return (
    <Link
      href={`/services?category=${encodeURIComponent(slug)}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">{name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description || 'Find trusted local professionals.'}</p>
        </div>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
          {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
        </span>
      </div>
    </Link>
  );
}
