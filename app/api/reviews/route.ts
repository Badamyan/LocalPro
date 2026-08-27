import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { reviewSchema } from '@/lib/validations/review';
import { createReview, getReviews } from '@/services/review-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerProfileId = searchParams.get('providerProfileId') || undefined;
  const serviceListingId = searchParams.get('serviceListingId') || undefined;
  if (!providerProfileId && !serviceListingId) return NextResponse.json({ success: false, error: 'A provider or service is required' }, { status: 400 });
  try {
    const data = await getReviews({ providerProfileId, serviceListingId });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json({ success: false, error: 'Unable to load reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role !== 'CUSTOMER') return NextResponse.json({ success: false, error: 'Only customers can create reviews' }, { status: 403 });
  try {
    const data = await createReview(session.user.id, reviewSchema.parse(await request.json()));
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'BOOKING_NOT_FOUND') return NextResponse.json({ success: false, error: 'Completed booking not found' }, { status: 404 });
    if (error instanceof Error && error.message === 'BOOKING_NOT_COMPLETED') return NextResponse.json({ success: false, error: 'Reviews are available after completion' }, { status: 422 });
    if (error instanceof Error && error.message === 'REVIEW_EXISTS') return NextResponse.json({ success: false, error: 'This booking has already been reviewed' }, { status: 409 });
    if (error instanceof Error && error.name === 'ZodError') return NextResponse.json({ success: false, error: 'Invalid review details' }, { status: 400 });
    console.error('Reviews POST error:', error);
    return NextResponse.json({ success: false, error: 'Unable to create review' }, { status: 500 });
  }
}
