import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const posts = await prisma.skillCirclePost.findMany({ where: { circleId: params.id }, include: { author: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })));
}

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const member = await prisma.skillCircleMember.findUnique({ where: { circleId_userId: { circleId: params.id, userId: auth.userId } } });
  if (!member) return NextResponse.json({ message: 'Join the circle first' }, { status: 403 });
  const { title, content } = await req.json();
  if (!title || !content) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  const post = await prisma.skillCirclePost.create({ data: { circleId: params.id, authorId: auth.userId, title, content } });
  return NextResponse.json({ id: post.id, createdAt: post.createdAt.toISOString() }, { status: 201 });
}
