import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { providerProfileSchema } from '@/lib/validations/provider-profile';
import { getProviderProfile, saveProviderProfile } from '@/services/provider-profile-service';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role !== 'PROVIDER') return NextResponse.json({ success: false, error: 'Provider access required' }, { status: 403 });

  const data = await getProviderProfile(session.user.id);
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  return saveProfile(request);
}

export async function PATCH(request: Request) {
  return saveProfile(request);
}

async function saveProfile(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  if (session.user.role !== 'PROVIDER') return NextResponse.json({ success: false, error: 'Provider access required' }, { status: 403 });

  try {
    const input = providerProfileSchema.parse(await request.json());
    const data = await saveProviderProfile(session.user.id, input);
    return NextResponse.json({ success: true, data }, { status: request.method === 'POST' ? 201 : 200 });
  } catch (error) {
    console.error('Provider profile save error:', error);
    return NextResponse.json({ success: false, error: 'Invalid provider profile data' }, { status: 400 });
  }
}