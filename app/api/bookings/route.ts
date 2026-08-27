import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { bookingCreateSchema } from '@/lib/validations/booking';
import { createBooking, getBookings } from '@/services/booking-service';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role === 'ADMIN') return NextResponse.json({ success: false, error: 'Booking access unavailable' }, { status: 403 });

  try {
    const data = await getBookings(session.user.id, session.user.role);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Bookings GET error:', error);
    return NextResponse.json({ success: false, error: 'Unable to load bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role !== 'CUSTOMER') return NextResponse.json({ success: false, error: 'Only customers can create bookings' }, { status: 403 });

  try {
    const input = bookingCreateSchema.parse(await request.json());
    const data = await createBooking(session.user.id, input);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'SERVICE_NOT_FOUND') return NextResponse.json({ success: false, error: 'Published service not found' }, { status: 404 });
    if (error instanceof Error && error.message === 'DURATION_REQUIRED') return NextResponse.json({ success: false, error: 'Duration is required for hourly services' }, { status: 422 });
    console.error('Bookings POST error:', error);
    return NextResponse.json({ success: false, error: 'Invalid booking details' }, { status: 400 });
  }
}