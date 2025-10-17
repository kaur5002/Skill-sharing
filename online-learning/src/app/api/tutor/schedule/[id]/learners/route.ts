import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest, context: any) {
	const user = getAuthUser(req);
	if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
	const { params } = context as { params: { id: string } };
	const id = params.id;
	const session = await prisma.session.findFirst({ where: { id, tutorId: user.userId }, select: { id: true, learnerId: true, courseId: true } });
	if (!session) return NextResponse.json({ message: 'Not found' }, { status: 404 });

	if (session.learnerId) {
		const learner = await prisma.user.findUnique({ where: { id: session.learnerId }, select: { id: true, name: true, email: true } });
		return NextResponse.json(learner ? [learner] : []);
	}

	if (session.courseId) {
		const learners = await prisma.enrollment.findMany({ where: { courseId: session.courseId, status: 'enrolled' }, include: { learner: { select: { id: true, name: true, email: true } } } });
		return NextResponse.json(learners.map((e) => e.learner));
	}

	return NextResponse.json([]);
}

