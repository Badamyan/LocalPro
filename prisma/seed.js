const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Home Cleaning', slug: 'home-cleaning', description: 'Reliable cleaning help for homes and apartments.' },
  { name: 'Handyman', slug: 'handyman', description: 'Practical repairs, assembly, and maintenance.' },
  { name: 'Tutoring', slug: 'tutoring', description: 'Personalized academic support from local tutors.' },
  { name: 'Beauty and Wellness', slug: 'beauty-wellness', description: 'At-home and local personal care services.' },
];

async function main() {
  const savedCategories = {};
  for (const category of categories) {
    savedCategories[category.slug] = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const provider = await prisma.user.upsert({
    where: { email: 'marketplace-demo-provider@localpro.test' },
    update: { name: 'LocalPro Demo Provider', role: 'PROVIDER' },
    create: {
      name: 'LocalPro Demo Provider',
      email: 'marketplace-demo-provider@localpro.test',
      passwordHash: 'seed-only-account-without-a-login-password',
      role: 'PROVIDER',
    },
  });

  const providerProfile = await prisma.providerProfile.upsert({
    where: { userId: provider.id },
    update: {
      businessName: 'Harbor & Home Services',
      tagline: 'Thoughtful help for the work around your home.',
      bio: 'A small local team focused on dependable home care, repairs, and practical improvements.',
      location: 'Portland and nearby neighborhoods',
      hourlyRate: 65,
      isVerified: true,
    },
    create: {
      userId: provider.id,
      businessName: 'Harbor & Home Services',
      tagline: 'Thoughtful help for the work around your home.',
      bio: 'A small local team focused on dependable home care, repairs, and practical improvements.',
      location: 'Portland and nearby neighborhoods',
      hourlyRate: 65,
      isVerified: true,
    },
  });

  const listings = [
    { title: 'Deep home cleaning', description: 'A thorough, detail-focused clean for kitchens, bathrooms, living spaces, and high-touch surfaces.', price: 120, priceType: 'FIXED', locationType: 'ONSITE', categoryId: savedCategories['home-cleaning'].id },
    { title: 'Furniture assembly and small repairs', description: 'Careful assembly, wall mounting, and small household repairs handled with the right tools.', price: 65, priceType: 'HOURLY', locationType: 'ONSITE', categoryId: savedCategories.handyman.id },
    { title: 'Study skills coaching', description: 'A structured remote session to help students build better study habits and organize their workload.', price: 45, priceType: 'HOURLY', locationType: 'REMOTE', categoryId: savedCategories.tutoring.id },
  ];

  for (const listing of listings) {
    const existing = await prisma.serviceListing.findFirst({ where: { providerProfileId: providerProfile.id, title: listing.title } });
    if (existing) {
      await prisma.serviceListing.update({ where: { id: existing.id }, data: { ...listing, status: 'PUBLISHED' } });
    } else {
      await prisma.serviceListing.create({ data: { ...listing, providerProfileId: providerProfile.id, status: 'PUBLISHED' } });
    }
  }

  console.log('LocalPro marketplace seed complete.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
