import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const sessions = await prisma.session.findMany({
    where: { learnerId: user.userId },
    orderBy: { startTime: 'desc' },
    select: {
      id: true,
      title: true,
      tutorId: true,
      startTime: true,
      endTime: true,
      status: true,
      meetingUrl: true,
      tutor: { select: { name: true } },
    },
  });
  return NextResponse.json(
    sessions.map((s) => ({
      id: s.id,
      tutorId: s.tutorId,
      tutorName: s.tutor?.name || 'Tutor',
      title: s.title,
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      status: s.status,
      meetingUrl: s.meetingUrl ?? undefined,
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { tutorId, title, startTime, endTime, meetingUrl } = body ?? {};
  if (!tutorId || !title || !startTime || !endTime) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }
  const created = await prisma.session.create({
    data: {
      title,
      tutorId,
      learnerId: user.userId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      meetingUrl,
      status: 'upcoming' as any,
    },
    select: { id: true },
  });
  return NextResponse.json({ id: created.id }, { status: 201 });
}
