import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const profile = await prisma.learnerProfile.findUnique({ where: { userId: auth.userId } });
  const interests = profile?.interests ?? [];
  const courses = await prisma.course.findMany({ where: { isPublished: true } });
  // naive score: tags overlap count + review avg weight
  const courseIds = courses.map(c => c.id);
  const ratings = await prisma.courseReview.groupBy({ by: ['courseId'], where: { courseId: { in: courseIds } }, _avg: { rating: true }, _count: { _all: true } });
  const ratingMap = new Map(ratings.map(r => [r.courseId, { avg: r._avg.rating ?? 0, count: r._count._all }]));
  const scored = courses
    .map(c => {
      const overlap = (c.tags || []).filter(t => interests.includes(t)).length;
      const r = ratingMap.get(c.id) || { avg: 0, count: 0 };
      const score = overlap * 2 + r.avg + Math.log10((r.count || 1));
      return { course: c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(s => s.course);

  // Tutor suggestions by expertise overlap
  const tutors = await prisma.tutorProfile.findMany();
  const tutorsScored = tutors
    .map(t => ({ t, overlap: (t.expertise || []).filter(e => interests.includes(e)).length, rating: t.rating }))
    .sort((a, b) => b.overlap - a.overlap || (b.rating - a.rating))
    .slice(0, 10)
    .map(x => x.t);

  return NextResponse.json({ courses: scored, tutors: tutorsScored });
}
