import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.tutorProfile.findMany({
    select: { id: true, expertise: true, rating: true, user: { select: { id: true, name: true } } },
  });
  return NextResponse.json(rows.map(r => ({ id: r.user.id, name: r.user.name, expertise: r.expertise, rating: r.rating })));
}
