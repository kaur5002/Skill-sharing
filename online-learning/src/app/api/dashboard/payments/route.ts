import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const rows = await prisma.payment.findMany({
    where: { learnerId: user.userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, amount: true, currency: true, status: true, createdAt: true, sessionId: true, tutor: { select: { name: true } } },
  });
  return NextResponse.json(rows.map(r => ({ id: r.id, amount: r.amount, currency: r.currency, status: r.status, createdAt: r.createdAt.toISOString(), sessionId: r.sessionId ?? undefined, tutorName: r.tutor?.name || 'Tutor' })));
}
