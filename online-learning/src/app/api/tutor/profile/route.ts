import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    // Ensure profile exists
    let profile = await prisma.tutorProfile.findUnique({
      where: { userId: user.userId },
      include: { socialLinks: true, certificates: true, verificationRequests: { orderBy: { submittedAt: 'desc' }, take: 1 } },
    });
    if (!profile) {
      profile = await prisma.tutorProfile.create({
        data: { userId: user.userId, expertise: [], bio: '', rating: 0 },
        include: { socialLinks: true, certificates: true, verificationRequests: { orderBy: { submittedAt: 'desc' }, take: 1 } },
      });
    }

    return NextResponse.json(profile);
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'tutor') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { bio, expertise, socialLinks } = body as { bio?: string; expertise?: string[]; socialLinks?: Array<{ provider: string; url: string }>; };

    // Upsert profile
    await prisma.tutorProfile.upsert({
      where: { userId: user.userId },
      update: { bio: bio ?? undefined, expertise: Array.isArray(expertise) ? expertise : undefined },
      create: { userId: user.userId, bio: bio ?? '', expertise: Array.isArray(expertise) ? expertise : [] },
    });

    // Replace social links if provided
    if (Array.isArray(socialLinks)) {
      const profile = await prisma.tutorProfile.findUnique({ where: { userId: user.userId } });
      if (profile) {
        await prisma.socialLink.deleteMany({ where: { tutorProfileId: profile.id } });
        if (socialLinks.length) {
          await prisma.socialLink.createMany({ data: socialLinks.map(l => ({ tutorProfileId: profile.id, provider: l.provider, url: l.url })) });
        }
      }
    }

    const updated = await prisma.tutorProfile.findUnique({
      where: { userId: user.userId },
      include: { socialLinks: true, certificates: true, verificationRequests: { orderBy: { submittedAt: 'desc' }, take: 1 } },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ message: e.message || 'Internal error' }, { status: 500 });
  }
}
