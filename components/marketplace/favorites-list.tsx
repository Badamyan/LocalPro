'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { FavoriteWithDetails } from '@/services/favorite-service';

type FavoritesListProps = {
  initialFavorites?: FavoriteWithDetails[];
};

const priceLabels: Record<string, string> = {
  HOURLY: 'per hour',
  FIXED: 'fixed price',
  CUSTOM: 'custom quote',
};

export function FavoritesList({ initialFavorites = [] }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteWithDetails[]>(initialFavorites);
  const [loading, setLoading] = useState<string | null>(null);

  const handleRemove = async (favoriteId: string, serviceId: string) => {
    try {
      setLoading(favoriteId);
      const res = await fetch(`/api/favorites/${serviceId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove favorite');
      const result = await res.json();
      if (result.success) {
        setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Collections</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Saved Services</h2>
        </div>
        <span className="text-sm text-slate-500">{favorites.length} saved</span>
      </div>
      <div className="mt-4 space-y-3">
        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
            No saved services yet.
            <p className="mt-2 text-sm">
              Browse{' '}
              <Link href="/services" className="font-semibold text-brand-700 hover:text-brand-800">
                all services
              </Link>{' '}
              and save your favorites.
            </p>
          </div>
        ) : (
          favorites.map((favorite) => (
            <article key={favorite.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
                    <span>{favorite.serviceListing.category.name}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{favorite.serviceListing.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {favorite.serviceListing.providerProfile.businessName}
                    {favorite.serviceListing.providerProfile.isVerified ? ' · Verified' : ''}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{favorite.serviceListing.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-900">${favorite.serviceListing.price.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{priceLabels[favorite.serviceListing.priceType]}</p>
                    </div>
                    <Link
                      href={`/services/${favorite.serviceListing.id}`}
                      className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                    >
                      View service
                    </Link>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(favorite.id, favorite.serviceListing.id)}
                  disabled={loading === favorite.id}
                  className="flex-shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  {loading === favorite.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
