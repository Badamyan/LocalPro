import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <main className="py-16">
      <div className="container-shell rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome back, {session.user.name}.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{session.user.role}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{session.user.email}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Authenticated</p>
          </div>
        </div>
      </div>
    </main>
  );
}
