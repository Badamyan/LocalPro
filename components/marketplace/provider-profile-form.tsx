'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Profile = {
  businessName: string;
  tagline: string | null;
  bio: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  hourlyRate: number | null;
  responseTimeHours: number | null;
};

const emptyProfile: Profile = { businessName: '', tagline: '', bio: '', location: '', city: '', state: '', country: '', hourlyRate: null, responseTimeHours: null };

export function ProviderProfileForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...(profile || emptyProfile), hourlyRate: profile?.hourlyRate?.toString() || '', responseTimeHours: profile?.responseTimeHours?.toString() || '' });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function update(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const response = await fetch('/api/provider/profile', { method: profile ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null, responseTimeHours: form.responseTimeHours ? Number(form.responseTimeHours) : null }) });
      const result = await response.json();
      if (!response.ok) { setError(result.error || 'Please check your profile details.'); return; }
      router.push('/provider/services');
      router.refresh();
    } catch { setError('Unable to save your provider profile.'); }
    finally { setIsSaving(false); }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <label className="block text-sm font-semibold text-slate-700">Business name<input required value={form.businessName} onChange={(event) => update('businessName', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-semibold text-slate-700">Tagline<input value={form.tagline || ''} onChange={(event) => update('tagline', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-semibold text-slate-700">About your business<textarea rows={5} value={form.bio || ''} onChange={(event) => update('bio', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <label className="block text-sm font-semibold text-slate-700">Location<input value={form.location || ''} onChange={(event) => update('location', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <div className="grid gap-4 sm:grid-cols-3"><label className="block text-sm font-semibold text-slate-700">City<input value={form.city || ''} onChange={(event) => update('city', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-semibold text-slate-700">State<input value={form.state || ''} onChange={(event) => update('state', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-semibold text-slate-700">Country<input value={form.country || ''} onChange={(event) => update('country', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label></div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-slate-700">Hourly rate<input type="number" min="0" step="0.01" value={form.hourlyRate} onChange={(event) => update('hourlyRate', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label><label className="block text-sm font-semibold text-slate-700">Response time (hours)<input type="number" min="1" value={form.responseTimeHours} onChange={(event) => update('responseTimeHours', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" /></label></div>
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={isSaving} className="rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{isSaving ? 'Saving...' : profile ? 'Save profile' : 'Create provider profile'}</button>
    </form>
  );
}