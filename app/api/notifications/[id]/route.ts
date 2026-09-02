import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { markAsRead } from '@/services/notification-service';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: Request, context: RouteContext) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });

  try {
    const data = await markAsRead(session.user.id, id);
    if (!data) return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Notification PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Unable to update notification' }, { status: 500 });
  }
}
