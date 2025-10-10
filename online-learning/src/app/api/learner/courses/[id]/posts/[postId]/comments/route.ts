import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string; postId: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const courseId = params.id;
  const postId = params.postId;
  const { content } = await req.json();
  if (!content) return NextResponse.json({ message: 'Missing content' }, { status: 400 });

  const enrollment = await prisma.enrollment.findUnique({ where: { courseId_learnerId: { courseId, learnerId: auth.userId } } });
  if (!enrollment) return NextResponse.json({ message: 'Not enrolled' }, { status: 403 });

  const post = await prisma.coursePost.findUnique({ where: { id: postId } });
  if (!post || post.courseId !== courseId) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  const comment = await prisma.courseComment.create({ data: { postId, authorId: auth.userId, content } });
  return NextResponse.json({ id: comment.id, createdAt: comment.createdAt.toISOString() }, { status: 201 });
}
