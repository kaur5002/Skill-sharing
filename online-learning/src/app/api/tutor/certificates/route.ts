import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const profile = await prisma.tutorProfile.findUnique({ where: { userId: user.userId } });
  if (!profile) return NextResponse.json([], { status: 200 });
  const certs = await prisma.certificate.findMany({ where: { tutorProfileId: profile.id }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(certs);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const profile = await prisma.tutorProfile.findUnique({ where: { userId: user.userId } });
  if (!profile) return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const { title, issuer, issueDate, url } = body as { title: string; issuer: string; issueDate?: string; url?: string };
  if (!title || !issuer) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  const created = await prisma.certificate.create({ data: { tutorProfileId: profile.id, title, issuer, issueDate: issueDate ? new Date(issueDate) : null, url: url || null } as any });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const profile = await prisma.tutorProfile.findUnique({ where: { userId: user.userId } });
  if (!profile) return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  await prisma.certificate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
