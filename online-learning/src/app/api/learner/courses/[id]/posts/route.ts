import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const courseId = params.id;
  const posts = await prisma.coursePost.findMany({ where: { courseId }, orderBy: { createdAt: 'desc' }, include: { author: true } });
  return NextResponse.json(posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })));
}

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const courseId = params.id;
  const body = await req.json();
  const { title, content } = body ?? {};
  if (!title || !content) return NextResponse.json({ message: 'Missing title or content' }, { status: 400 });

  // must be enrolled
  const enrollment = await prisma.enrollment.findUnique({ where: { courseId_learnerId: { courseId, learnerId: auth.userId } } });
  if (!enrollment) return NextResponse.json({ message: 'Not enrolled' }, { status: 403 });

  const post = await prisma.coursePost.create({ data: { courseId, authorId: auth.userId, title, content } });
  return NextResponse.json({ id: post.id, createdAt: post.createdAt.toISOString() }, { status: 201 });
}
