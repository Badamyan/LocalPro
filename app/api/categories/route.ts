import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: { _count: { select: { services: { where: { status: 'PUBLISHED' } } } } },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json({ success: false, error: 'Unable to load categories' }, { status: 500 });
  }
}
