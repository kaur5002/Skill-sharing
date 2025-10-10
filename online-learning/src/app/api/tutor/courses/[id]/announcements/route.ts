import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const c = await prisma.course.findFirst({ where: { id: params.id, tutorId: user.userId } });
  if (!c) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const anns = await prisma.courseAnnouncement.findMany({ where: { courseId: params.id }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(anns.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })));
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const c = await prisma.course.findFirst({ where: { id: params.id, tutorId: user.userId } });
  if (!c) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const { title, content } = await req.json();
  if (!title || !content) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  const created = await prisma.courseAnnouncement.create({ data: { courseId: params.id, title, content } });
  return NextResponse.json({ id: created.id, createdAt: created.createdAt.toISOString() }, { status: 201 });
}
