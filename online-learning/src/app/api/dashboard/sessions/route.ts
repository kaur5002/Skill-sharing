import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const rows = await prisma.session.findMany({
    where: { learnerId: user.userId },
    orderBy: { startTime: 'asc' },
    select: { id: true, title: true, startTime: true, endTime: true, meetingUrl: true, status: true, tutor: { select: { name: true } } },
  });
  return NextResponse.json(rows.map(s => ({ id: s.id, title: s.title, tutorName: s.tutor?.name || 'Tutor', startTime: s.startTime.toISOString(), endTime: s.endTime.toISOString(), meetingUrl: s.meetingUrl ?? undefined, status: s.status })));
}
