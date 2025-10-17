import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const offers = await prisma.barterOffer.findMany({ where: { active: true } });
  const filtered = q ? offers.filter(o => o.offerSkill.toLowerCase().includes(q) || o.wantSkill.toLowerCase().includes(q) || (o.description || '').toLowerCase().includes(q)) : offers;
  return NextResponse.json(filtered);
}
