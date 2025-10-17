import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  // Get latest 1 message per conversation partner (learner)
  const messages = await prisma.message.findMany({
    where: { OR: [{ fromId: user.userId }, { toId: user.userId }] },
    orderBy: { sentAt: 'desc' },
    take: 200,
  });
  const partners = new Map<string, typeof messages[0]>();
  for (const m of messages) {
    const partnerId = m.fromId === user.userId ? m.toId : m.fromId;
    if (!partners.has(partnerId)) partners.set(partnerId, m);
  }
  const partnerIds = Array.from(partners.keys());
  const learners = await prisma.user.findMany({ where: { id: { in: partnerIds } }, select: { id: true, name: true } });
  const learnerById = new Map(learners.map(l => [l.id, l]));
  const threads = Array.from(partners.entries()).map(([partnerId, last]) => ({
    partnerId,
    partnerName: learnerById.get(partnerId)?.name ?? 'Learner',
    lastText: last.text,
    lastAt: last.sentAt.toISOString(),
    unread: last.toId === user.userId && !last.read,
  }));
  return NextResponse.json(threads);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { toId, text, sessionId } = await req.json();
  if (!toId || !text) return NextResponse.json({ message: 'Missing toId or text' }, { status: 400 });
  const created = await prisma.message.create({ data: { fromId: user.userId, toId, text, sessionId: sessionId ?? null, read: false } });
  // Optionally create a notification for the learner
  await prisma.notification.create({ data: { userId: toId, type: 'message', title: 'New message', body: text.slice(0, 140) } }).catch(() => {});
  return NextResponse.json({ id: created.id, sentAt: created.sentAt.toISOString() }, { status: 201 });
}
