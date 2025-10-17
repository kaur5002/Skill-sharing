import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const msgs = await prisma.message.findMany({
    where: { OR: [{ fromId: user.userId }, { toId: user.userId }] },
    orderBy: { sentAt: 'desc' },
    take: 50,
    select: { id: true, fromId: true, toId: true, sentAt: true, text: true, read: true },
  });
  return NextResponse.json(msgs.map(m => ({ ...m, sentAt: m.sentAt.toISOString() })));
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { toId, text, sessionId } = body ?? {};
  if (!toId || !text) return NextResponse.json({ message: 'Missing toId or text' }, { status: 400 });
  const created = await prisma.message.create({
    data: {
      fromId: user.userId,
      toId,
      text,
      read: false,
      sessionId: sessionId ?? undefined,
    },
    select: { id: true, sentAt: true },
  });
  return NextResponse.json({ id: created.id, sentAt: created.sentAt.toISOString() }, { status: 201 });
}
