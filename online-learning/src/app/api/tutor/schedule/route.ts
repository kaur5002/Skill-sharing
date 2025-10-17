import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const where: any = { tutorId: user.userId };
  if (from) where.startTime = { gte: new Date(from) };
  if (to) {
    where.endTime = where.endTime || {};
    where.endTime.lte = new Date(to);
  }
  const sessions = await prisma.session.findMany({
    where,
    orderBy: { startTime: 'asc' },
    select: {
      id: true,
      title: true,
      startTime: true,
      endTime: true,
      status: true,
      type: true,
      description: true,
      canceledAt: true,
      canceledReason: true,
      meetingUrl: true,
      meetingPlatform: true,
      learner: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
    },
  });
  return NextResponse.json(
    sessions.map((s) => ({
      id: s.id,
      title: s.title,
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      status: s.status,
      type: s.type ?? 'live',
      description: s.description ?? undefined,
      canceledAt: s.canceledAt ? s.canceledAt.toISOString() : undefined,
      canceledReason: s.canceledReason ?? undefined,
      meetingUrl: s.meetingUrl ?? undefined,
      meetingPlatform: s.meetingPlatform ?? undefined,
      learnerId: s.learner?.id,
      learnerName: s.learner?.name,
      courseId: s.course?.id,
      courseTitle: s.course?.title,
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({} as any));
  const { learnerId, courseId, title, startTime, endTime, meetingUrl, meetingPlatform, description, type } = body ?? {};
  if (!title || !startTime || !endTime) return NextResponse.json({ message: 'Missing fields: title, startTime, endTime' }, { status: 400 });
  if (!learnerId && !courseId) return NextResponse.json({ message: 'Either learnerId or courseId is required' }, { status: 400 });
  const data: any = {
    title,
    tutorId: user.userId,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    meetingUrl: meetingUrl || null,
    meetingPlatform: meetingPlatform || null,
    description: description || null,
    type: type || 'live',
    status: 'upcoming' as any,
  };
  if (learnerId) data.learnerId = learnerId;
  if (courseId) data.courseId = courseId;

  const created = await prisma.session.create({ data, select: { id: true, courseId: true, learnerId: true } });

  // Send notifications to impacted learners
  try {
    if (created.learnerId) {
      await prisma.notification.create({
        data: {
          userId: created.learnerId,
          type: 'session_created',
          title: 'New session scheduled',
          body: `${title} scheduled` ,
          data: { sessionId: created.id, startTime, endTime },
        } as any,
      });
    } else if (created.courseId) {
      const enrollments = await prisma.enrollment.findMany({ where: { courseId: created.courseId, status: 'enrolled' } });
      if (enrollments.length) {
        await prisma.notification.createMany({
          data: enrollments.map((e) => ({
            userId: e.learnerId,
            type: 'session_created',
            title: 'New course session',
            body: `${title} scheduled for your course`,
            data: { sessionId: created.id, courseId: created.courseId, startTime, endTime } as any,
          })),
        });
      }
    }
  } catch (e) {
    // Non-blocking notifications failure
    console.error('Failed to create notifications for session create', e);
  }

  return NextResponse.json({ id: created.id }, { status: 201 });
}
