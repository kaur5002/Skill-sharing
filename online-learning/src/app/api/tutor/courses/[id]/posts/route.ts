import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest, context: any) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { params } = context as { params: { id: string } };
  const course = await prisma.course.findFirst({ where: { id: params.id, tutorId: user.userId } });
  if (!course) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const posts = await prisma.coursePost.findMany({ where: { courseId: params.id }, orderBy: { createdAt: 'desc' }, include: { comments: true } });
  return NextResponse.json(posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString(), comments: p.comments.map(c => ({ ...c, createdAt: c.createdAt.toISOString() })) })));
}

export async function POST(req: NextRequest, context: any) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { params } = context as { params: { id: string } };
  const course = await prisma.course.findFirst({ where: { id: params.id, tutorId: user.userId } });
  if (!course) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const { title, content } = await req.json();
  if (!title || !content) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  const created = await prisma.coursePost.create({ data: { courseId: params.id, authorId: user.userId, title, content } });
  return NextResponse.json({ id: created.id, createdAt: created.createdAt.toISOString() }, { status: 201 });
}
