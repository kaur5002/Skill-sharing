import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const payments = await prisma.payment.findMany({ where: { learnerId: auth.userId }, orderBy: { createdAt: 'desc' }, include: { course: true, session: true } });
  return NextResponse.json(payments.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })));
}
