import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const now = new Date();
  const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [upcoming, live, completed, cancelled, next7days] = await Promise.all([
    prisma.session.count({ where: { tutorId: user.userId, status: 'upcoming' as any } }),
    prisma.session.count({ where: { tutorId: user.userId, status: 'live' as any } }),
    prisma.session.count({ where: { tutorId: user.userId, status: 'completed' as any } }),
    prisma.session.count({ where: { tutorId: user.userId, status: 'cancelled' as any } }),
    prisma.session.count({ where: { tutorId: user.userId, startTime: { gte: now, lte: in7d } } }),
  ]);

  return NextResponse.json({ upcoming, live, completed, cancelled, next7days });
}
