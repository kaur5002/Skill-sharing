import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const enrollments = await prisma.enrollment.findMany({ where: { learnerId: auth.userId }, include: { course: true } });
  const byCourse = [] as any[];
  for (const e of enrollments) {
    const totalLessons = 10; // Placeholder: replace with actual count when lessons exist
    const completed = await (prisma as any).courseProgress.count({ where: { enrollmentId: e.id, completed: true } });
    const percent = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
    byCourse.push({ courseId: e.courseId, courseTitle: e.course.title, percent });
  }
  // Total hours learned from sessions
  const sessions = await prisma.session.findMany({ where: { learnerId: auth.userId, status: 'completed' } });
  const totalMinutes = sessions.reduce((sum, s) => sum + Math.max(0, Math.round((+s.endTime - +s.startTime) / 60000)), 0);
  return NextResponse.json({ byCourse, totalHours: Math.round(totalMinutes / 60) });
}
