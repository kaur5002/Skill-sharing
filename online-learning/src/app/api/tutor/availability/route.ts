import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const slots = await prisma.availabilitySlot.findMany({ where: { tutorId: user.userId }, orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }] });
  return NextResponse.json(slots);
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const { dayOfWeek, startTime, endTime, timezone } = body as { dayOfWeek: number; startTime: string; endTime: string; timezone?: string };
  if (typeof dayOfWeek !== 'number' || !startTime || !endTime) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  const created = await prisma.availabilitySlot.create({ data: { tutorId: user.userId, dayOfWeek, startTime, endTime, timezone: timezone || 'UTC' } });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  await prisma.availabilitySlot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
