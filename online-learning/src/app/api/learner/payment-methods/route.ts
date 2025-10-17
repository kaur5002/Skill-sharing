import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const methods = await prisma.paymentMethod.findMany({ where: { userId: auth.userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(methods);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { brand, last4, expMonth, expYear, isDefault } = await req.json();
  if (!brand || !last4 || !expMonth || !expYear) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  if (isDefault) {
    await prisma.paymentMethod.updateMany({ where: { userId: auth.userId }, data: { isDefault: false } });
  }
  const created = await prisma.paymentMethod.create({ data: { userId: auth.userId, brand, last4, expMonth, expYear, isDefault: !!isDefault } });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  await prisma.paymentMethod.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
