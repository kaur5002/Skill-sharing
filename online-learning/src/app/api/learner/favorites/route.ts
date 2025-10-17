import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await (prisma as any).favoriteCourse.findMany({ where: { learnerId: auth.userId }, include: { course: true } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
  const item = await (prisma as any).favoriteCourse.upsert({
    where: { learnerId_courseId: { learnerId: auth.userId, courseId } },
    update: {},
    create: { learnerId: auth.userId, courseId },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
  await (prisma as any).favoriteCourse.delete({ where: { learnerId_courseId: { learnerId: auth.userId, courseId } } });
  return NextResponse.json({ ok: true });
}
