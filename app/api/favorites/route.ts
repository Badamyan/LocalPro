import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { favoriteServiceIdSchema } from '@/lib/validations/favorite';
import { addFavorite, getFavorites } from '@/services/favorite-service';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role !== 'CUSTOMER') return NextResponse.json({ success: false, error: 'Only customers can view favorites' }, { status: 403 });

  try {
    const data = await getFavorites(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Favorites GET error:', error);
    return NextResponse.json({ success: false, error: 'Unable to load favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role !== 'CUSTOMER') return NextResponse.json({ success: false, error: 'Only customers can add favorites' }, { status: 403 });

  try {
    const input = favoriteServiceIdSchema.parse(await request.json());
    const data = await addFavorite(session.user.id, input.serviceListingId);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'SERVICE_NOT_FOUND') return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    if (error instanceof Error && error.message === 'SERVICE_NOT_PUBLISHED') return NextResponse.json({ success: false, error: 'This service is not available' }, { status: 422 });
    if (error instanceof Error && error.message === 'FAVORITE_EXISTS') return NextResponse.json({ success: false, error: 'This service is already in your favorites' }, { status: 409 });
    if (error instanceof Error && error.name === 'ZodError') return NextResponse.json({ success: false, error: 'Invalid service ID' }, { status: 400 });
    console.error('Favorites POST error:', error);
    return NextResponse.json({ success: false, error: 'Unable to add favorite' }, { status: 500 });
  }
}
