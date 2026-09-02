'use client';

import { useState } from 'react';

type FavoriteButtonProps = {
  serviceId: string;
  initialIsFavorite?: boolean;
};

export function FavoriteButton({ serviceId, initialIsFavorite = false }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      setIsLoading(true);

      if (isFavorite) {
        const res = await fetch(`/api/favorites/${serviceId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove favorite');
        const result = await res.json();
        if (result.success) setIsFavorite(false);
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serviceListingId: serviceId }),
        });
        if (!res.ok) throw new Error('Failed to add favorite');
        const result = await res.json();
        if (result.success) setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="text-lg">{isFavorite ? '♥' : '♡'}</span>
      <span>{isFavorite ? 'Saved' : 'Save'}</span>
    </button>
  );
}
