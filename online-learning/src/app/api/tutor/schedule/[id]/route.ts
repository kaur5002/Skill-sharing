import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function PATCH(req: NextRequest, context: any) {
	const user = getAuthUser(req);
	if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
	const { params } = context as { params: { id: string } };
	const id = params.id;
	const body = await req.json().catch(() => ({}));
	const { title, startTime, endTime, meetingUrl, meetingPlatform, description, type, status, learnerId, courseId } = body as any;

	// Ensure ownership
	const existing = await prisma.session.findFirst({ where: { id, tutorId: user.userId }, select: { id: true, courseId: true, learnerId: true, title: true } });
	if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

	const data: any = {};
	if (typeof title === 'string') data.title = title;
	if (startTime) data.startTime = new Date(startTime);
	if (endTime) data.endTime = new Date(endTime);
	if (typeof meetingUrl === 'string' || meetingUrl === null) data.meetingUrl = meetingUrl;
	if (typeof meetingPlatform === 'string' || meetingPlatform === null) data.meetingPlatform = meetingPlatform;
	if (typeof description === 'string' || description === null) data.description = description;
	if (typeof type === 'string') data.type = type;
	if (typeof status === 'string') data.status = status as any;
	if (typeof learnerId === 'string' || learnerId === null) data.learnerId = learnerId;
	if (typeof courseId === 'string' || courseId === null) data.courseId = courseId;

	const updated = await prisma.session.update({ where: { id }, data, select: { id: true, courseId: true, learnerId: true, title: true } });

	// Notify impacted learners about update
	try {
		const targets: string[] = [];
		if (updated.learnerId) targets.push(updated.learnerId);
		else if (updated.courseId) {
			const enrollments = await prisma.enrollment.findMany({ where: { courseId: updated.courseId, status: 'enrolled' } });
			targets.push(...enrollments.map((e) => e.learnerId));
		}
		if (targets.length) {
			await prisma.notification.createMany({
				data: targets.map((uid) => ({ userId: uid, type: 'session_updated', title: 'Session updated', body: `${existing.title} was updated`, data: { sessionId: id } as any })),
			});
		}
	} catch (e) {
		console.error('Failed to notify on session update', e);
	}

	return NextResponse.json({ id: updated.id });
}

export async function DELETE(req: NextRequest, context: any) {
	const user = getAuthUser(req);
	if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
	const { params } = context as { params: { id: string } };
	const id = params.id;
	const body = await req.json().catch(() => ({}));
	const { reason } = body as any;

	// Instead of hard delete, mark as cancelled
	const existing = await prisma.session.findFirst({ where: { id, tutorId: user.userId }, select: { id: true, courseId: true, learnerId: true, title: true } });
	if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

	const updated = await prisma.session.update({ where: { id }, data: { status: 'cancelled' as any, canceledAt: new Date(), canceledReason: reason || null }, select: { id: true, courseId: true, learnerId: true, title: true } });

	// Notify impacted learners about cancellation
	try {
		const targets: string[] = [];
		if (updated.learnerId) targets.push(updated.learnerId);
		else if (updated.courseId) {
			const enrollments = await prisma.enrollment.findMany({ where: { courseId: updated.courseId, status: 'enrolled' } });
			targets.push(...enrollments.map((e) => e.learnerId));
		}
		if (targets.length) {
			await prisma.notification.createMany({
				data: targets.map((uid) => ({ userId: uid, type: 'session_cancelled', title: 'Session cancelled', body: `${existing.title} was cancelled`, data: { sessionId: id, reason } as any })),
			});
		}
	} catch (e) {
		console.error('Failed to notify on session cancel', e);
	}

	return NextResponse.json({ id: updated.id, status: 'cancelled' });
}

