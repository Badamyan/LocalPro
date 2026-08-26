"use client";

import { FormEvent, useState } from 'react';

type Category = { id: string; name: string };
type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: string;
  durationMinutes: number | null;
  locationType: string;
  status: string;
  categoryId: string;
  category: { name: string };
};

type Props = { categories: Category[]; initialListings: Listing[] };

const initialForm = { categoryId: '', title: '', description: '', price: '0', priceType: 'HOURLY', durationMinutes: '', locationType: 'ONSITE', status: 'DRAFT' };

export function ProviderListingManager({ categories, initialListings }: Props) {
  const [listings, setListings] = useState(initialListings);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function beginEdit(listing: Listing) {
    setEditingId(listing.id);
    setForm({ categoryId: listing.categoryId, title: listing.title, description: listing.description, price: String(listing.price), priceType: listing.priceType, durationMinutes: listing.durationMinutes ? String(listing.durationMinutes) : '', locationType: listing.locationType, status: listing.status });
    setMessage(null);
    setError(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...initialForm, categoryId: categories[0]?.id || '' });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const response = await fetch(editingId ? `/api/services/${editingId}` : '/api/services', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(typeof result.error === 'string' ? result.error : 'Please check the listing details.');
      return;
    }
    setListings((current) => editingId ? current.map((listing) => listing.id === editingId ? result.data : listing) : [result.data, ...current]);
    setMessage(editingId ? 'Listing updated.' : 'Listing created.');
    resetForm();
  }

  async function remove(id: string) {
    setError(null);
    const response = await fetch(`/api/services/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setError('Unable to delete this listing.');
      return;
    }
    setListings((current) => current.filter((listing) => listing.id !== id));
    setMessage('Listing deleted.');
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={submit} className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div><h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit listing' : 'Add a service'}</h2><p className="mt-1 text-sm text-slate-600">Only you can manage your provider listings.</p></div>
        <input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Service title" className="w-full rounded-xl border border-slate-300 px-3 py-2" required />
        <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Describe the service" rows={5} className="w-full rounded-xl border border-slate-300 px-3 py-2" required />
        <select value={form.categoryId} onChange={(event) => updateField('categoryId', event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" required><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
        <div className="grid grid-cols-2 gap-3"><input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField('price', event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Price" required /><input type="number" min="1" value={form.durationMinutes} onChange={(event) => updateField('durationMinutes', event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Minutes" /></div>
        <div className="grid grid-cols-2 gap-3"><select value={form.priceType} onChange={(event) => updateField('priceType', event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2"><option value="HOURLY">Hourly</option><option value="FIXED">Fixed price</option><option value="CUSTOM">Custom quote</option></select><select value={form.locationType} onChange={(event) => updateField('locationType', event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2"><option value="ONSITE">On-site</option><option value="REMOTE">Remote</option><option value="BOTH">Both</option></select></div>
        <select value={form.status} onChange={(event) => updateField('status', event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="PAUSED">Paused</option></select>
        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}{message ? <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">{message}</p> : null}
        <div className="flex gap-3"><button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">{editingId ? 'Save changes' : 'Create listing'}</button>{editingId ? <button type="button" onClick={resetForm} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700">Cancel</button> : null}</div>
      </form>
      <section className="space-y-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Your listings</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Manage services</h2></div>{listings.map((listing) => <article key={listing.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700"><span>{listing.category.name}</span><span className="text-slate-500">{listing.status}</span></div><h3 className="mt-2 text-xl font-bold text-slate-900">{listing.title}</h3><p className="mt-2 text-sm text-slate-600">${listing.price.toFixed(2)} · {listing.priceType} · {listing.locationType}</p></div><div className="flex gap-2"><button type="button" onClick={() => beginEdit(listing)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Edit</button><button type="button" onClick={() => remove(listing.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Delete</button></div></div></article>)}{listings.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">You have not created any listings yet.</div> : null}</section>
    </div>
  );
}
