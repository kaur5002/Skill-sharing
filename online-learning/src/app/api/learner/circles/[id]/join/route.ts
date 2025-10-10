import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  await prisma.skillCircleMember.upsert({ where: { circleId_userId: { circleId: params.id, userId: auth.userId } }, update: {}, create: { circleId: params.id, userId: auth.userId } });
  return NextResponse.json({ ok: true });
}
