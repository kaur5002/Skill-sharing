import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const saved = await (prisma as any).savedTutor.findMany({ where: { learnerId: auth.userId }, include: { tutor: true } });
  return NextResponse.json(saved);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { tutorId } = await req.json();
  if (!tutorId) return NextResponse.json({ error: 'tutorId is required' }, { status: 400 });
  const item = await (prisma as any).savedTutor.upsert({
    where: { learnerId_tutorId: { learnerId: auth.userId, tutorId } },
    update: {},
    create: { learnerId: auth.userId, tutorId },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { tutorId } = await req.json();
  if (!tutorId) return NextResponse.json({ error: 'tutorId is required' }, { status: 400 });
  await (prisma as any).savedTutor.delete({ where: { learnerId_tutorId: { learnerId: auth.userId, tutorId } } });
  return NextResponse.json({ ok: true });
}
