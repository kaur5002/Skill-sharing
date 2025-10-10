import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { paymentId, reason } = await req.json();
  if (!paymentId || !reason) return NextResponse.json({ error: 'paymentId and reason are required' }, { status: 400 });

  // Ensure payment belongs to learner
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.learnerId !== auth.userId) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const rr = await (prisma as any).refundRequest.create({ data: { paymentId, reason, status: 'requested' } });
  return NextResponse.json(rr);
}
