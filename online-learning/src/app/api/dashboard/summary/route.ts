import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const now = new Date();
    const nextSession = await prisma.session.findFirst({
      where: { learnerId: user.userId, startTime: { gt: now }, status: { in: ['upcoming', 'live'] as any } },
      orderBy: { startTime: 'asc' },
      select: { startTime: true },
    });

    const unreadMessages = await prisma.message.count({ where: { toId: user.userId, read: false } });
    const totalHoursAgg = await prisma.session.aggregate({
      where: { learnerId: user.userId, status: 'completed' as any },
      _sum: { /* MongoDB doesn't support date diff aggregation via Prisma; approximate client-side */ },
    });
    // Fallback simple count for now
    const completedSessions = await prisma.session.findMany({ where: { learnerId: user.userId, status: 'completed' as any }, select: { startTime: true, endTime: true } });
    const totalHours = completedSessions.reduce((acc, s) => acc + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 36e5, 0);

    const achievementsCount = await prisma.achievement.count({ where: { learnerId: user.userId } });

    return NextResponse.json({
      nextSessionAt: nextSession?.startTime?.toISOString() ?? null,
      unreadMessages,
      totalHours: Math.round(totalHours * 10) / 10,
      achievementsCount,
    });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Internal error' }, { status: 500 });
  }
}
