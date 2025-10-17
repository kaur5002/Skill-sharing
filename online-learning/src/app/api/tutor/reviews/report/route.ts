import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { reviewId, reason } = await req.json();
  if (!reviewId || !reason) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  const review = await prisma.courseReview.findUnique({ where: { id: reviewId }, include: { course: true } });
  if (!review || review.course.tutorId !== user.userId) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const created = await prisma.reviewReport.create({ data: { reviewId, reason } });
  return NextResponse.json({ id: created.id, createdAt: created.createdAt.toISOString() }, { status: 201 });
}
