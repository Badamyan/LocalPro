import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ProviderProfileForm } from '@/components/marketplace/provider-profile-form';
import { getProviderProfile } from '@/services/provider-profile-service';

export default async function ProviderProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'PROVIDER') redirect('/dashboard');
  const profile = await getProviderProfile(session.user.id);

  return <main className="py-12"><div className="container-shell"><Link href="/provider/services" className="text-sm font-semibold text-brand-700 hover:text-brand-800">Back to provider workspace</Link><p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Provider workspace</p><h1 className="mt-3 text-4xl font-bold text-slate-900">{profile ? 'Edit provider profile' : 'Create provider profile'}</h1><p className="mt-3 max-w-2xl text-slate-600">Add the details customers will see before you publish your services.</p><div className="mt-8"><ProviderProfileForm profile={profile} /></div></div></main>;
}