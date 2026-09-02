import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getNotifications } from '@/services/notification-service';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });

  try {
    const data = await getNotifications(session.user.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({ success: false, error: 'Unable to load notifications' }, { status: 500 });
  }
}
