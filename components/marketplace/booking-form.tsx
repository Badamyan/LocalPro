'use client';

import { FormEvent, useState } from 'react';

type BookingFormProps = {
  serviceId: string;
  price: number;
  priceType: string;
  durationMinutes: number | null;
};

export function BookingForm({ serviceId, price, priceType, durationMinutes }: BookingFormProps) {
  const [scheduledDate, setScheduledDate] = useState('');
  const [duration, setDuration] = useState(durationMinutes ? String(durationMinutes) : '');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceListingId: serviceId, scheduledDate, durationMinutes: duration ? Number(duration) : null, notes: notes || null }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Unable to request this service.');
        return;
      }
      setMessage('Request sent. The provider will review your booking.');
      setScheduledDate('');
      setNotes('');
    } catch {
      setError('Unable to reach LocalPro. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const estimate = priceType === 'HOURLY' && duration ? (price * Number(duration) / 60).toFixed(2) : priceType === 'FIXED' ? price.toFixed(2) : null;

  return (
    <form onSubmit={submit} className="mt-7 space-y-4 border-t border-slate-700 pt-6">
      <div>
        <h3 className="text-xl font-bold">Request this service</h3>
        <p className="mt-1 text-sm text-slate-300">Choose a time and tell the provider what you need.</p>
      </div>
      <label className="block text-sm font-semibold">Scheduled date and time<input type="datetime-local" required value={scheduledDate} min={new Date().toISOString().slice(0, 16)} onChange={(event) => setScheduledDate(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-white" /></label>
      {priceType === 'HOURLY' ? <label className="block text-sm font-semibold">Duration in minutes<input type="number" required min="1" max="1440" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder={durationMinutes ? String(durationMinutes) : 'e.g. 120'} className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-white" /></label> : null}
      <label className="block text-sm font-semibold">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} maxLength={2000} placeholder="Anything the provider should know?" className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-white" /></label>
      {estimate ? <p className="text-sm text-slate-300">Estimated total: <strong className="text-white">${estimate}</strong></p> : null}
      {error ? <p className="rounded-lg bg-red-950 px-3 py-2 text-sm text-red-200">{error}</p> : null}
      {message ? <p className="rounded-lg bg-emerald-950 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-brand-400 px-4 py-3 font-semibold text-slate-950 hover:bg-brand-300 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? 'Sending request...' : 'Request booking'}</button>
    </form>
  );
}