import { NextResponse } from 'next/server';
import { getProviderReviewSummary } from '@/services/review-service';

export async function GET(request: Request) {
  const providerProfileId = new URL(request.url).searchParams.get('providerProfileId');
  if (!providerProfileId) return NextResponse.json({ success: false, error: 'Provider is required' }, { status: 400 });
  const data = await getProviderReviewSummary(providerProfileId);
  return NextResponse.json({ success: true, data });
}
