import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const sessions = await prisma.session.findMany({
    where: { tutorId: user.userId },
    orderBy: { startTime: 'asc' },
    select: { id: true, title: true, startTime: true, endTime: true, status: true, meetingUrl: true, learner: { select: { id: true, name: true } } },
  });
  return NextResponse.json(sessions.map(s => ({ id: s.id, title: s.title, startTime: s.startTime.toISOString(), endTime: s.endTime.toISOString(), status: s.status, meetingUrl: s.meetingUrl ?? undefined, learnerId: s.learner.id, learnerName: s.learner.name })));
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const { learnerId, title, startTime, endTime, meetingUrl } = body ?? {};
  if (!learnerId || !title || !startTime || !endTime) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  const created = await prisma.session.create({ data: { title, tutorId: user.userId, learnerId, startTime: new Date(startTime), endTime: new Date(endTime), meetingUrl, status: 'upcoming' as any }, select: { id: true } });
  return NextResponse.json({ id: created.id }, { status: 201 });
}
