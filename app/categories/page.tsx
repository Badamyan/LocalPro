import { CategoryCard } from '@/components/marketplace/category-card';
import { prisma } from '@/lib/prisma';

export default async function CategoriesPage() {
  const categories = await prisma.serviceCategory.findMany({
    include: { _count: { select: { services: { where: { status: 'PUBLISHED' } } } } },
    orderBy: { name: 'asc' },
  });

  return (
    <main className="py-12">
      <div className="container-shell">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Browse by category</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Find the right local service</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Explore trusted professionals grouped by the work they do best.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              slug={category.slug}
              description={category.description}
              serviceCount={category._count.services}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
