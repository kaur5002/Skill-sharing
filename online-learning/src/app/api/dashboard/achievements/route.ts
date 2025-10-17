import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const rows = await prisma.achievement.findMany({
    where: { learnerId: user.userId },
    orderBy: { unlockedAt: 'desc' },
    take: 50,
    select: { id: true, title: true, description: true, unlockedAt: true, icon: true },
  });
  return NextResponse.json(rows.map(a => ({ ...a, unlockedAt: a.unlockedAt.toISOString() })));
}
