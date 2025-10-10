import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const tickets = await prisma.supportTicket.findMany({ where: { authorId: user.userId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(tickets.map(t => ({ ...t, createdAt: t.createdAt.toISOString() })));
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { subject, message } = await req.json();
  if (!subject || !message) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  const created = await prisma.supportTicket.create({ data: { authorId: user.userId, subject, message } });
  return NextResponse.json({ id: created.id, createdAt: created.createdAt.toISOString() }, { status: 201 });
}
