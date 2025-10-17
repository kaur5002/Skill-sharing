import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const reviews = await prisma.courseReview.findMany({ where: { learnerId: auth.userId }, orderBy: { createdAt: 'desc' }, include: { course: true } });
  return NextResponse.json(reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
}
