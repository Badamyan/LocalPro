import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { serviceListingSchema } from '@/lib/validations/service';
import { deleteProviderListing, getPublishedListing, updateProviderListing } from '@/services/service-listing-service';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const data = await getPublishedListing(id);

  if (!data) {
    return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }
  if (session.user.role !== 'PROVIDER') {
    return NextResponse.json({ success: false, error: 'Only providers can update listings' }, { status: 403 });
  }

  try {
    const input = serviceListingSchema.parse(await request.json());
    const data = await updateProviderListing(session.user.id, id, input);

    if (!data) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Service PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Invalid service listing data' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }
  if (session.user.role !== 'PROVIDER') {
    return NextResponse.json({ success: false, error: 'Only providers can delete listings' }, { status: 403 });
  }

  const deleted = await deleteProviderListing(session.user.id, id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: deleted });
}
