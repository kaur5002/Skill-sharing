import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const offers = await prisma.barterOffer.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(offers);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { offerSkill, wantSkill, description } = await req.json();
  if (!offerSkill || !wantSkill) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  const created = await prisma.barterOffer.create({ data: { userId: auth.userId, offerSkill, wantSkill, description: description ?? null } });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  await prisma.barterOffer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
