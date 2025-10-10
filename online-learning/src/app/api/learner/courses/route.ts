import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const enrollments = await prisma.enrollment.findMany({
    where: { learnerId: auth.userId },
    include: {
      course: { include: { tutor: true } },
    },
    orderBy: { createdAt: 'desc' },
  }) as any[];

  const categorized = {
    enrolled: enrollments.filter(e => e.status === 'enrolled'),
    completed: enrollments.filter(e => e.status === 'completed'),
    pending: enrollments.filter(e => e.status === 'pending'),
  };
  return NextResponse.json(categorized);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { action, courseId, lessonId, completed } = await req.json();

  if (action === 'enroll') {
    if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    const enrollment = await (prisma as any).enrollment.upsert({
      where: { courseId_learnerId: { courseId, learnerId: auth.userId } },
      update: { status: 'enrolled' },
      create: { courseId, learnerId: auth.userId, status: 'enrolled' },
    });
    return NextResponse.json(enrollment);
  }

  if (action === 'progress') {
    if (!courseId || !lessonId) return NextResponse.json({ error: 'courseId and lessonId are required' }, { status: 400 });
  const enrollment = await prisma.enrollment.findUnique({ where: { courseId_learnerId: { courseId, learnerId: auth.userId } } }) as any;
    if (!enrollment) return NextResponse.json({ error: 'Not enrolled' }, { status: 404 });
    const cp = await (prisma as any).courseProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      update: { completed: completed ?? true, completedAt: completed ? new Date() : null },
      create: { enrollmentId: enrollment.id, lessonId, completed: completed ?? true, completedAt: completed ? new Date() : null },
    });
    return NextResponse.json(cp);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
