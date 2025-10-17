import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const payment = await prisma.payment.findUnique({ where: { id: params.id } });
  if (!payment || payment.learnerId !== auth.userId) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  // Placeholder: return basic invoice JSON. Can be replaced with a PDF later.
  return NextResponse.json({
    invoiceId: payment.id,
    date: payment.createdAt.toISOString(),
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
  });
}
