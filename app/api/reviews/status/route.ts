import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCustomerReviewStatus } from '@/services/review-service';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role !== 'CUSTOMER') return NextResponse.json({ success: false, error: 'Customer access required' }, { status: 403 });
  const bookingId = new URL(request.url).searchParams.get('bookingId');
  if (!bookingId) return NextResponse.json({ success: false, error: 'Booking is required' }, { status: 400 });
  const data = await getCustomerReviewStatus(session.user.id, bookingId);
  if (!data) return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
  return NextResponse.json({ success: true, data });
}
