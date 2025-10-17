import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { courseId, amount, currency, paymentMethodId } = await req.json();
  if (!courseId || !amount || !currency) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  // Placeholder: create Payment record as 'paid'. Real integration would talk to a PSP.
  const payment = await prisma.payment.create({ data: { learnerId: auth.userId, tutorId: (await prisma.course.findUnique({ where: { id: courseId } }))!.tutorId, amount, currency, status: 'paid', courseId } });
  // Ensure enrollment as well
  await prisma.enrollment.upsert({ where: { courseId_learnerId: { courseId, learnerId: auth.userId } }, update: { status: 'enrolled' }, create: { courseId, learnerId: auth.userId, status: 'enrolled' } });
  return NextResponse.json({ id: payment.id, createdAt: payment.createdAt.toISOString() }, { status: 201 });
}
