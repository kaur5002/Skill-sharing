import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Lightweight placeholder endpoint to scan upcoming sessions in a time window
// and create reminder notifications. We don't persist reminder flags in schema
// to keep it simple; idempotency can be handled externally by scheduler cadence.
export async function POST(_req: NextRequest) {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in1h = new Date(now.getTime() + 60 * 60 * 1000);

  // 24h window reminders
  const sessions24h = await prisma.session.findMany({
    where: { status: 'upcoming' as any, startTime: { gte: now, lte: in24h } },
    select: { id: true, title: true, startTime: true, learnerId: true, courseId: true },
  });

  // 1h window reminders
  const sessions1h = await prisma.session.findMany({
    where: { status: 'upcoming' as any, startTime: { gte: now, lte: in1h } },
    select: { id: true, title: true, startTime: true, learnerId: true, courseId: true },
  });

  const notifyFor = async (sessions: typeof sessions24h, type: 'reminder_24h' | 'reminder_1h') => {
    for (const s of sessions) {
      if (s.learnerId) {
        await prisma.notification.create({
          data: {
            userId: s.learnerId,
            type,
            title: type === 'reminder_24h' ? 'Session in 24 hours' : 'Session in 1 hour',
            body: `${s.title} at ${s.startTime.toLocaleString()}`,
            data: { sessionId: s.id } as any,
          },
        });
      } else if (s.courseId) {
        const enrollments = await prisma.enrollment.findMany({ where: { courseId: s.courseId, status: 'enrolled' } });
        if (enrollments.length) {
          await prisma.notification.createMany({
            data: enrollments.map((e) => ({
              userId: e.learnerId,
              type,
              title: type === 'reminder_24h' ? 'Course session in 24 hours' : 'Course session in 1 hour',
              body: `${s.title} at ${s.startTime.toLocaleString()}`,
              data: { sessionId: s.id, courseId: s.courseId } as any,
            })),
          });
        }
      }
    }
  };

  await notifyFor(sessions24h, 'reminder_24h');
  await notifyFor(sessions1h, 'reminder_1h');

  return NextResponse.json({ sent24h: sessions24h.length, sent1h: sessions1h.length });
}
