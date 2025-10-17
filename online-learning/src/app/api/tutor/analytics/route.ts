import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const now = new Date();
  const since = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30); // last 30 days

  const sessions = await prisma.session.findMany({ where: { tutorId: user.userId, startTime: { gte: since } }, select: { startTime: true, learnerId: true, status: true } });
  const learnersJoined = new Set(sessions.map(s => s.learnerId)).size;
  const messagesCount = await prisma.message.count({ where: { toId: user.userId, sentAt: { gte: since } } });
  const feedbackCount = await prisma.courseReview.count({ where: { course: { tutorId: user.userId }, createdAt: { gte: since } } });
  const earningsPaid = await prisma.payment.aggregate({ _sum: { amount: true, platformFeeAmount: true }, where: { tutorId: user.userId, status: 'paid' as any, createdAt: { gte: since } } });
  const earningsNet = (earningsPaid._sum.amount || 0) - (earningsPaid._sum.platformFeeAmount || 0);

  // rating trend (weekly buckets over last 8 weeks)
  const eightWeeksAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7 * 8);
  const reviews = await prisma.courseReview.findMany({ where: { course: { tutorId: user.userId }, createdAt: { gte: eightWeeksAgo } }, select: { rating: true, createdAt: true } });
  const trendBuckets: { [weekStart: string]: { total: number; count: number } } = {};
  for (const r of reviews) {
    const d = new Date(r.createdAt);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    weekStart.setHours(0,0,0,0);
    const key = weekStart.toISOString();
    trendBuckets[key] = trendBuckets[key] || { total: 0, count: 0 };
    trendBuckets[key].total += r.rating;
    trendBuckets[key].count += 1;
  }
  const ratingTrend = Object.entries(trendBuckets)
    .sort((a,b) => a[0] < b[0] ? -1 : 1)
    .map(([weekStart, stats]) => ({ weekStart, avg: Math.round((stats.total / stats.count) * 10) / 10, count: stats.count }));

  // top courses by reviews and sessions
  const topCourses = await prisma.course.findMany({
    where: { tutorId: user.userId },
    select: { id: true, title: true, reviews: { select: { rating: true } }, sessions: { select: { id: true } } },
  }).then(rows => rows.map(r => ({ id: r.id, title: r.title, reviewsCount: r.reviews.length, avgRating: r.reviews.length ? (r.reviews.reduce((a, v) => a + v.rating, 0) / r.reviews.length) : 0, sessionsCount: r.sessions.length }))
    .sort((a,b) => (b.avgRating - a.avgRating) || (b.reviewsCount - a.reviewsCount))
    .slice(0, 5));

  const engagementRate = {
    messages: messagesCount,
    sessions: sessions.length,
    feedback: feedbackCount,
  };

  // simple suggestion text (placeholder heuristic)
  const suggestion = 'Courses with higher reviews in your category charge $25–$40/session.';

  return NextResponse.json({
    sessionsCount: sessions.length,
    learnersJoined,
    earningsNet: Math.round(earningsNet * 100) / 100,
    ratingTrend,
    topCourses,
    engagementRate,
    suggestion,
  });
}
