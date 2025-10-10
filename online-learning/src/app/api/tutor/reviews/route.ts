import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const courseIds = await prisma.course.findMany({ where: { tutorId: user.userId }, select: { id: true } }).then(r => r.map(x => x.id));
  if (courseIds.length === 0) return NextResponse.json({ averageRating: 0, count: 0, reviews: [] });

  const reviews = await prisma.courseReview.findMany({
    where: { courseId: { in: courseIds } },
    orderBy: { createdAt: 'desc' },
    include: { course: { select: { id: true, title: true } }, learner: { select: { id: true, name: true } }, reports: true },
  });

  const averageRating = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  return NextResponse.json({
    averageRating: Math.round(averageRating * 10) / 10,
    count: reviews.length,
    reviews: reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })),
  });
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { reviewId, reply } = await req.json();
  if (!reviewId || !reply) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  // Ensure the review belongs to one of tutor's courses
  const review = await prisma.courseReview.findUnique({ where: { id: reviewId }, include: { course: true } });
  if (!review || review.course.tutorId !== user.userId) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const updated = await prisma.courseReview.update({ where: { id: reviewId }, data: { reply, replyAt: new Date() } });
  return NextResponse.json({ id: updated.id, replyAt: updated.replyAt?.toISOString() });
}
