import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { tutorId, reason } = await req.json();
  if (!tutorId || !reason) return NextResponse.json({ message: 'Missing tutorId or reason' }, { status: 400 });
  const report = await prisma.userReport.create({ data: { reporterId: auth.userId, subjectId: tutorId, reason } });
  return NextResponse.json({ id: report.id, createdAt: report.createdAt.toISOString() }, { status: 201 });
}
