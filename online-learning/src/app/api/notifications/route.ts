import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const notes = await prisma.notification.findMany({ where: { userId: user.userId }, orderBy: { createdAt: 'desc' }, take: 50 });
  return NextResponse.json(notes.map(n => ({ ...n, createdAt: n.createdAt.toISOString() })));
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { id, read } = await req.json();
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  await prisma.notification.update({ where: { id }, data: { read: !!read } });
  return NextResponse.json({ ok: true });
}
