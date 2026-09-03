import Link from 'next/link';
import { FavoriteButton } from './favorite-button';

type ServiceCardProps = {
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    priceType: string;
    locationType: string;
    category: { name: string };
    providerProfile: { id: string; businessName: string; isVerified: boolean };
    averageRating?: number;
    reviewCount?: number;
  };
};

const priceLabels: Record<string, string> = {
  HOURLY: 'per hour',
  FIXED: 'fixed price',
  CUSTOM: 'custom quote',
};

const locationLabels: Record<string, string> = {
  ONSITE: 'On-site',
  REMOTE: 'Remote',
  BOTH: 'On-site or remote',
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-brand-700">
          <span>{service.category.name}</span>
          <span className="text-slate-500">{locationLabels[service.locationType]}</span>
        </div>
        <FavoriteButton serviceId={service.id} />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900">{service.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{service.description}</p>

      {/* Rating display */}
      {service.averageRating !== undefined && service.reviewCount !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-sm">
          <span className="text-amber-500">★</span>
          <strong className="text-slate-900">{service.averageRating.toFixed(1)}</strong>
          <span className="text-slate-500">({service.reviewCount} {service.reviewCount === 1 ? 'review' : 'reviews'})</span>
        </div>
      )}

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-slate-900">${service.price.toFixed(2)}</p>
          <p className="text-xs text-slate-500">{priceLabels[service.priceType]}</p>
        </div>
        <Link href={`/services/${service.id}`} className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          View service
        </Link>
      </div>
      <Link href={`/providers/${service.providerProfile.id}`} className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600 hover:text-brand-700">
        {service.providerProfile.businessName}{service.providerProfile.isVerified ? ' · Verified' : ''}
      </Link>
    </article>
  );
}
