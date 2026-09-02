import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { removeFavorite } from '@/services/favorite-service';

type RouteContext = { params: Promise<{ serviceId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  const { serviceId } = await context.params;
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role !== 'CUSTOMER') return NextResponse.json({ success: false, error: 'Only customers can remove favorites' }, { status: 403 });

  try {
    if (!serviceId || serviceId.length === 0) return NextResponse.json({ success: false, error: 'Service ID is required' }, { status: 400 });
    
    const data = await removeFavorite(session.user.id, serviceId);
    if (!data) return NextResponse.json({ success: false, error: 'Favorite not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Favorites DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Unable to remove favorite' }, { status: 500 });
  }
}
