import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { courseId, reason } = await req.json();
  if (!courseId || !reason) return NextResponse.json({ message: 'Missing courseId or reason' }, { status: 400 });
  const ticket = await prisma.supportTicket.create({ data: { authorId: auth.userId, subject: `Course report: ${courseId}`, message: reason, status: 'open' } });
  return NextResponse.json({ id: ticket.id, createdAt: ticket.createdAt.toISOString() }, { status: 201 });
}
