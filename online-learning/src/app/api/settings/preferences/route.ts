import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const s = await prisma.userSettings.findUnique({ where: { userId: user.userId } })
    || await prisma.userSettings.create({ data: { userId: user.userId } });
  return NextResponse.json(s);
}

export async function PUT(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { emailNotifications, pushNotifications, theme } = body as any;
  const s = await prisma.userSettings.upsert({
    where: { userId: user.userId },
    update: { emailNotifications: !!emailNotifications, pushNotifications: !!pushNotifications, theme: theme || 'system' },
    create: { userId: user.userId, emailNotifications: !!emailNotifications, pushNotifications: !!pushNotifications, theme: theme || 'system' },
  });
  return NextResponse.json(s);
}
