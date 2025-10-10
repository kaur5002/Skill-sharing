import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const courses = await prisma.course.findMany({ where: { tutorId: user.userId }, orderBy: { createdAt: 'desc' }, include: { materials: true, sessions: true } });
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const { title, description, price, durationMinutes, skillLevel, category, tags, coverImageUrl, introVideoUrl, isPublished } = body as any;
  if (!title || !description) return NextResponse.json({ message: 'Title and description required' }, { status: 400 });
  const created = await prisma.course.create({
    data: {
      tutorId: user.userId,
      title,
      description,
      price: typeof price === 'number' ? price : 0,
      durationMinutes: typeof durationMinutes === 'number' ? durationMinutes : 60,
      skillLevel: skillLevel || 'beginner',
      category: category || null,
      tags: Array.isArray(tags) ? tags : [],
      coverImageUrl: coverImageUrl || null,
      introVideoUrl: introVideoUrl || null,
      isPublished: !!isPublished,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
