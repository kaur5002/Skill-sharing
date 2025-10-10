import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const rows = await prisma.payout.findMany({ where: { tutorId: user.userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { amount, method, destination } = await req.json();
  if (!amount || !method) return NextResponse.json({ message: 'Missing amount or method' }, { status: 400 });
  const created = await prisma.payout.create({ data: { tutorId: user.userId, amount: Number(amount), method, destination: destination || null } });
  return NextResponse.json({ id: created.id, createdAt: created.createdAt.toISOString() }, { status: 201 });
}
