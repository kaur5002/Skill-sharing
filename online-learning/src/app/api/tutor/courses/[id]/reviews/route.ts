import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest, context: any) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { params } = context as { params: { id: string } };
  const course = await prisma.course.findFirst({ where: { id: params.id, tutorId: user.userId } });
  if (!course) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const reviews = await prisma.courseReview.findMany({ where: { courseId: params.id }, orderBy: { createdAt: 'desc' }, include: { learner: { select: { id: true, name: true } } } });
  return NextResponse.json(reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
}

export async function POST(req: NextRequest, context: any) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { params } = context as { params: { id: string } };
  const course = await prisma.course.findFirst({ where: { id: params.id, tutorId: user.userId } });
  if (!course) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const { reviewId, reply } = await req.json();
  if (!reviewId || !reply) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  const updated = await prisma.courseReview.update({ where: { id: reviewId }, data: { reply, replyAt: new Date() } });
  return NextResponse.json({ id: updated.id, replyAt: updated.replyAt?.toISOString() }, { status: 200 });
}
