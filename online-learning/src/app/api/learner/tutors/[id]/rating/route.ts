import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const tutorId = params.id;
  const courses = await prisma.course.findMany({ where: { tutorId }, select: { id: true } });
  const ids = courses.map(c => c.id);
  if (ids.length === 0) return NextResponse.json({ avg: 0, count: 0 });
  const reviews = await prisma.courseReview.findMany({ where: { courseId: { in: ids } }, select: { rating: true } });
  const count = reviews.length;
  const avg = count ? reviews.reduce((a, b) => a + b.rating, 0) / count : 0;
  return NextResponse.json({ avg, count });
}
