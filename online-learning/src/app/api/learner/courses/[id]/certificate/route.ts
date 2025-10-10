import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const courseId = params.id;
  // Simple rule: >= 80% progress issues certificate
  const enrollment = await prisma.enrollment.findUnique({ where: { courseId_learnerId: { courseId, learnerId: auth.userId } } });
  if (!enrollment) return NextResponse.json({ message: 'Not enrolled' }, { status: 403 });
  const totalLessons = 10; // placeholder
  const completed = await (prisma as any).courseProgress.count({ where: { enrollmentId: enrollment.id, completed: true } });
  const percent = totalLessons ? completed / totalLessons : 0;
  if (percent < 0.8) return NextResponse.json({ message: 'Progress below 80%' }, { status: 400 });
  const cert = await prisma.courseCertificate.upsert({
    where: { courseId_learnerId: { courseId, learnerId: auth.userId } },
    update: {},
    create: { courseId, learnerId: auth.userId, url: null },
  });
  return NextResponse.json({ id: cert.id, issuedAt: cert.issuedAt.toISOString() }, { status: 201 });
}
