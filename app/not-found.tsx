export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">404</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you requested does not exist in the LocalPro app.</p>
      </div>
    </main>
  );
}
