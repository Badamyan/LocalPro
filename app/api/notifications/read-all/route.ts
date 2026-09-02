import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { markAllAsRead } from '@/services/notification-service';

export async function PATCH() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });

  try {
    const result = await markAllAsRead(session.user.id);
    return NextResponse.json({ success: true, data: { updated: result.count } });
  } catch (error) {
    console.error('Notifications read-all PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Unable to update notifications' }, { status: 500 });
  }
}
