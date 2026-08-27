'use client';

import { useState } from 'react';

type BookingAction = { id: string; status: string };

export function BookingActions({ booking, provider }: { booking: BookingAction; provider?: boolean }) {
  const [status, setStatus] = useState(booking.status);
  const [error, setError] = useState<string | null>(null);

  async function update(nextStatus: string) {
    setError(null);
    const response = await fetch(`/api/bookings/${booking.id}`, {
      method: provider ? 'PATCH' : 'DELETE',
      ...(provider ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }) } : {}),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Unable to update booking.');
      return;
    }
    setStatus(result.data.status);
  }

  if (provider && status === 'PENDING') {
    return <div className="flex flex-wrap gap-2"><button type="button" onClick={() => update('ACCEPTED')} className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white">Accept</button><button type="button" onClick={() => update('REJECTED')} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Reject</button>{error ? <span className="text-sm text-red-700">{error}</span> : null}</div>;
  }
  if (provider && status === 'ACCEPTED') return <div><button type="button" onClick={() => update('COMPLETED')} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Mark completed</button>{error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}</div>;
  if (!provider && (status === 'PENDING' || status === 'ACCEPTED')) return <div><button type="button" onClick={() => update('CANCELLED')} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Cancel booking</button>{error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}</div>;
  return null;
}