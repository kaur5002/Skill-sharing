import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const anyPrisma = prisma as any;
    const profile = await anyPrisma.learnerProfile.findUnique({
      where: { userId: auth.userId },
    });

    const settings = await prisma.userSettings.findUnique({
      where: { userId: auth.userId },
    });

    return NextResponse.json({ profile, settings });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'learner') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bio, goals, interests, categories, photoUrl, settings } = body;

    const updated = await prisma.$transaction(async (tx) => {
      const anyTx = tx as any;
      const profile = await anyTx.learnerProfile.upsert({
        where: { userId: auth.userId },
        create: {
          userId: auth.userId,
          bio: bio ?? null,
          goals: goals ?? null,
          interests: interests ?? [],
          categories: categories ?? [],
          photoUrl: photoUrl ?? null,
        },
        update: {
          bio: bio ?? null,
          goals: goals ?? null,
          interests: interests ?? [],
          categories: categories ?? [],
          photoUrl: photoUrl ?? null,
        },
      });

      let settingsResult = null as any;
      if (settings) {
        settingsResult = await tx.userSettings.upsert({
          where: { userId: auth.userId },
          create: {
            userId: auth.userId,
            emailNotifications: settings.emailNotifications ?? true,
            pushNotifications: settings.pushNotifications ?? true,
            theme: settings.theme ?? 'system',
          },
          update: {
            emailNotifications: settings.emailNotifications ?? true,
            pushNotifications: settings.pushNotifications ?? true,
            theme: settings.theme ?? 'system',
          },
        });
      }

      return { profile, settings: settingsResult };
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
