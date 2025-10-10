import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const rows = await prisma.payment.findMany({
    where: { tutorId: user.userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, amount: true, currency: true, status: true, createdAt: true, learner: { select: { id: true, name: true } } },
  });
  return NextResponse.json(rows.map(r => ({ id: r.id, amount: r.amount, currency: r.currency, status: r.status, createdAt: r.createdAt.toISOString(), learnerId: r.learner.id, learnerName: r.learner.name })));
}
