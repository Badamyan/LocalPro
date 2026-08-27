import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { bookingUpdateSchema } from '@/lib/validations/booking';
import { getBooking, updateBooking, cancelBooking } from '@/services/booking-service';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role === 'ADMIN') return NextResponse.json({ success: false, error: 'Booking access unavailable' }, { status: 403 });
  const data = await getBooking(session.user.id, session.user.role, id);
  if (!data) return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role === 'ADMIN') return NextResponse.json({ success: false, error: 'Booking access unavailable' }, { status: 403 });
  try {
    const input = bookingUpdateSchema.parse(await request.json());
    const data = await updateBooking(session.user.id, session.user.role, id, input);
    if (!data) return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_TRANSITION') return NextResponse.json({ success: false, error: 'That booking status change is not allowed' }, { status: 422 });
    return NextResponse.json({ success: false, error: 'Invalid booking update' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role !== 'CUSTOMER') return NextResponse.json({ success: false, error: 'Only customers can cancel bookings' }, { status: 403 });
  try {
    const data = await cancelBooking(session.user.id, id);
    if (!data) return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_TRANSITION') return NextResponse.json({ success: false, error: 'This booking cannot be cancelled' }, { status: 422 });
    return NextResponse.json({ success: false, error: 'Unable to cancel booking' }, { status: 400 });
  }
}