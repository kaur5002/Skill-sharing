import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { learnerId, reason } = await req.json();
  if (!learnerId || !reason) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  const created = await prisma.userReport.create({ data: { reporterId: user.userId, subjectId: learnerId, reason } });
  return NextResponse.json({ id: created.id, createdAt: created.createdAt.toISOString() }, { status: 201 });
}
