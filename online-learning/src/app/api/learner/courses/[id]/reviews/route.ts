import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const courseId = params.id;
  const list = await prisma.courseReview.findMany({ where: { courseId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(list.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
}

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const courseId = params.id;
  const { rating, comment } = await req.json();
  if (!rating || rating < 1 || rating > 5) return NextResponse.json({ message: 'Rating must be 1-5' }, { status: 400 });
  // must be enrolled
  const enrollment = await prisma.enrollment.findUnique({ where: { courseId_learnerId: { courseId, learnerId: auth.userId } } });
  if (!enrollment) return NextResponse.json({ message: 'Not enrolled' }, { status: 403 });
  const review = await prisma.courseReview.upsert({
    where: { courseId_learnerId: { courseId, learnerId: auth.userId } },
    update: { rating, comment },
    create: { courseId, learnerId: auth.userId, rating, comment },
  });
  return NextResponse.json({ id: review.id, createdAt: review.createdAt.toISOString() }, { status: 201 });
}
