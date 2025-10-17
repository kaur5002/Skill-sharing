import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest, context: any) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { params } = context as { params: { id: string } };
  const courseId = params.id;
  const materials = await prisma.courseMaterial.findMany({ where: { courseId } });
  return NextResponse.json(materials);
}

export async function POST(req: NextRequest, context: any) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { params } = context as { params: { id: string } };
  const courseId = params.id;
  const body = await req.json().catch(() => ({}));
  const { type, title, url } = body as { type: 'pdf' | 'video' | 'slide' | 'image' | 'other'; title: string; url: string };
  if (!type || !title || !url) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  // Ensure the course belongs to the tutor
  const course = await prisma.course.findFirst({ where: { id: courseId, tutorId: user.userId } });
  if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });
  const created = await prisma.courseMaterial.create({ data: { courseId, type, title, url } });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest, context: any) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { params } = context as { params: { id: string } };
  const courseId = params.id;
  const { searchParams } = new URL(req.url);
  const materialId = searchParams.get('materialId');
  if (!materialId) return NextResponse.json({ message: 'Missing materialId' }, { status: 400 });
  // Validate ownership
  const course = await prisma.course.findFirst({ where: { id: courseId, tutorId: user.userId } });
  if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });
  await prisma.courseMaterial.delete({ where: { id: materialId } });
  return NextResponse.json({ ok: true });
}
