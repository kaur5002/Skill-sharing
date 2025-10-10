import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const sessions = await prisma.session.findMany({ where: { tutorId: user.userId }, select: { learner: { select: { id: true, name: true, email: true } } } });
  const map = new Map<string, { id: string; name: string; email: string }>();
  sessions.forEach(s => { if (s.learner) map.set(s.learner.id, s.learner); });
  return NextResponse.json(Array.from(map.values()));
}
