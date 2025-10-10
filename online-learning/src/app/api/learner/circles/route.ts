import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const circles = await prisma.skillCircle.findMany({ include: { _count: { select: { members: true } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(circles);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { title, topic, description } = await req.json();
  if (!title || !topic) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  const circle = await prisma.skillCircle.create({ data: { title, topic, description: description ?? null } });
  // auto join creator
  await prisma.skillCircleMember.create({ data: { circleId: circle.id, userId: auth.userId, role: 'moderator' } });
  return NextResponse.json(circle, { status: 201 });
}
