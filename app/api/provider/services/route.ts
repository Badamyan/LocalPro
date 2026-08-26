import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProviderListings } from '@/services/service-listing-service';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }
  if (session.user.role !== 'PROVIDER') {
    return NextResponse.json({ success: false, error: 'Provider access required' }, { status: 403 });
  }

  const data = await getProviderListings(session.user.id);
  return NextResponse.json({ success: true, data });
}
