'use client';

import { useState } from 'react';

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const response = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId, rating, comment: comment || null }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error || 'Unable to submit review.'); return; }
    setSubmitted(true);
    setMessage('Review submitted. Thank you.');
  }

  if (submitted) return <p className="text-sm font-semibold text-brand-700">{message}</p>;
  return <form onSubmit={submit} className="mt-4 space-y-3">
    <div><label htmlFor={`rating-${bookingId}`} className="block text-sm font-semibold text-slate-700">Rating</label><select id={`rating-${bookingId}`} value={rating} onChange={(event) => setRating(Number(event.target.value))} className="mt-1 rounded-lg border border-slate-300 px-3 py-2"><option value="5">★★★★★ (5)</option><option value="4">★★★★☆ (4)</option><option value="3">★★★☆☆ (3)</option><option value="2">★★☆☆☆ (2)</option><option value="1">★☆☆☆☆ (1)</option></select></div>
    <div><label htmlFor={`comment-${bookingId}`} className="block text-sm font-semibold text-slate-700">Comment <span className="font-normal text-slate-500">(optional)</span></label><textarea id={`comment-${bookingId}`} value={comment} onChange={(event) => setComment(event.target.value)} maxLength={2000} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></div>
    <button type="submit" className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700">Leave review</button>
    {message ? <p className="text-sm text-red-700">{message}</p> : null}
  </form>;
}
