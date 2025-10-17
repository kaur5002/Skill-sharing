import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string; postId: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const member = await prisma.skillCircleMember.findUnique({ where: { circleId_userId: { circleId: params.id, userId: auth.userId } } });
  if (!member) return NextResponse.json({ message: 'Join the circle first' }, { status: 403 });
  const { content } = await req.json();
  if (!content) return NextResponse.json({ message: 'Missing content' }, { status: 400 });
  const post = await prisma.skillCirclePost.findUnique({ where: { id: params.postId } });
  if (!post || post.circleId !== params.id) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const created = await prisma.skillCircleComment.create({ data: { postId: params.postId, authorId: auth.userId, content } });
  return NextResponse.json({ id: created.id, createdAt: created.createdAt.toISOString() }, { status: 201 });
}
