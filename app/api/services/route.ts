import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { serviceListingSchema, serviceQuerySchema } from '@/lib/validations/service';
import { createProviderListing, getPublishedListings } from '@/services/service-listing-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = serviceQuerySchema.parse({
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      priceType: searchParams.get('priceType') || undefined,
      locationType: searchParams.get('locationType') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      minRating: searchParams.get('minRating') || undefined,
      sort: searchParams.get('sort') || undefined,
    });
    const data = await getPublishedListings(filters);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json({ success: false, error: 'Invalid service filters or unavailable services' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  if (session.user.role !== 'PROVIDER') {
    return NextResponse.json({ success: false, error: 'Only providers can create listings' }, { status: 403 });
  }

  try {
    const input = serviceListingSchema.parse(await request.json());
    const data = await createProviderListing(session.user.id, input);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'PROVIDER_PROFILE_REQUIRED') {
      return NextResponse.json({ success: false, error: 'Create a provider profile before adding listings' }, { status: 422 });
    }

    console.error('Services POST error:', error);
    return NextResponse.json({ success: false, error: 'Invalid service listing data' }, { status: 400 });
  }
}
