import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const msgs = await prisma.circleMessage.findMany({ where: { circleId: params.id }, orderBy: { sentAt: 'desc' }, take: 100 });
  return NextResponse.json(msgs.map(m => ({ ...m, sentAt: m.sentAt.toISOString() })));
}

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const member = await prisma.skillCircleMember.findUnique({ where: { circleId_userId: { circleId: params.id, userId: auth.userId } } });
  if (!member) return NextResponse.json({ message: 'Join the circle first' }, { status: 403 });
  const { text } = await req.json();
  if (!text) return NextResponse.json({ message: 'Missing text' }, { status: 400 });
  const created = await prisma.circleMessage.create({ data: { circleId: params.id, authorId: auth.userId, text } });
  return NextResponse.json({ id: created.id, sentAt: created.sentAt.toISOString() }, { status: 201 });
}
