import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const payments = await prisma.payment.findMany({ where: { tutorId: user.userId, status: 'paid' as any }, select: { amount: true, platformFeeAmount: true } });
  const totalEarningsGross = payments.reduce((a, p) => a + p.amount, 0);
  const totalFees = payments.reduce((a, p) => a + (p.platformFeeAmount || 0), 0);
  const totalNet = totalEarningsGross - totalFees;
  const pending = await prisma.payment.aggregate({ _sum: { amount: true }, where: { tutorId: user.userId, status: 'pending' as any } });
  const payouts = await prisma.payout.findMany({ where: { tutorId: user.userId }, orderBy: { createdAt: 'desc' } });

  return NextResponse.json({
    gross: Math.round(totalEarningsGross * 100) / 100,
    net: Math.round(totalNet * 100) / 100,
    fees: Math.round(totalFees * 100) / 100,
    pendingAmount: Math.round((pending._sum.amount || 0) * 100) / 100,
    payouts: payouts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })),
  });
}
