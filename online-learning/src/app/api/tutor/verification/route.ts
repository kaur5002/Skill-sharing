import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const profile = await prisma.tutorProfile.findUnique({ where: { userId: user.userId } });
  if (!profile) return NextResponse.json({ status: 'none' });
  const latest = await prisma.verificationRequest.findFirst({ where: { tutorProfileId: profile.id }, orderBy: { submittedAt: 'desc' } });
  return NextResponse.json(latest || { status: 'none' });
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const profile = await prisma.tutorProfile.findUnique({ where: { userId: user.userId } });
  if (!profile) return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const { documents, note } = body as { documents?: string[]; note?: string };
  const created = await prisma.verificationRequest.create({ data: { tutorProfileId: profile.id, documents: Array.isArray(documents) ? documents : [], note: note || null } });
  return NextResponse.json(created, { status: 201 });
}
