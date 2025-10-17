import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const now = new Date();
    const nextSession = await prisma.session.findFirst({
      where: { tutorId: user.userId, startTime: { gt: now }, status: { in: ['upcoming', 'live'] as any } },
      orderBy: { startTime: 'asc' },
      select: { startTime: true },
    });

    const unreadMessages = await prisma.message.count({ where: { toId: user.userId, read: false } });

    const completed = await prisma.session.findMany({
      where: { tutorId: user.userId, status: 'completed' as any },
      select: { startTime: true, endTime: true, payments: { select: { amount: true, status: true } } },
    });

    const totalTeachingHours = completed.reduce((acc, s) => acc + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 36e5, 0);
    const totalEarnings = completed.flatMap(s => s.payments).filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);

    const studentsCount = await prisma.session.groupBy({
      by: ['learnerId'],
      where: { tutorId: user.userId },
      _count: { _all: true },
    }).then(rows => new Set(rows.map(r => r.learnerId)).size);

    return NextResponse.json({
      nextSessionAt: nextSession?.startTime?.toISOString() ?? null,
      unreadMessages,
      totalTeachingHours: Math.round(totalTeachingHours * 10) / 10,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      studentsCount,
    });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Internal error' }, { status: 500 });
  }
}
