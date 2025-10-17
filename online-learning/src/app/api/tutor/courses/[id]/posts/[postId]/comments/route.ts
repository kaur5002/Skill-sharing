import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function POST(req: NextRequest, context: any) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // Tutors can comment as well; learners would use a separate auth flow
  const { params } = context as { params: { id: string; postId: string } };
  const course = await prisma.course.findFirst({ where: { id: params.id, tutorId: user.userId } });
  if (!course) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const { content } = await req.json();
  if (!content) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  const created = await prisma.courseComment.create({ data: { postId: params.postId, authorId: user.userId, content } });
  return NextResponse.json({ id: created.id, createdAt: created.createdAt.toISOString() }, { status: 201 });
}
