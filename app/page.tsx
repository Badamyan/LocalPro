export default function HomePage() {
  return (
    <main className="py-16">
      <section className="container-shell rounded-3xl border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
            Phase 1 foundation
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            LocalPro
          </h1>

          <p className="max-w-2xl text-lg text-slate-600">
            A local service marketplace foundation for browsing providers, organizing categories,
            and preparing the core product architecture for the first MVP release.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Project</p>
              <p className="mt-2 text-xl font-bold text-slate-900">Portfolio-ready</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Stack</p>
              <p className="mt-2 text-xl font-bold text-slate-900">Next.js + Prisma</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Status</p>
              <p className="mt-2 text-xl font-bold text-slate-900">Phase 1 base</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
