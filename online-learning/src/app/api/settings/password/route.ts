import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/api-helpers';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
  if (!dbUser) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const ok = await verifyPassword(dbUser.password, currentPassword);
  if (!ok) return NextResponse.json({ message: 'Current password incorrect' }, { status: 400 });
  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.userId }, data: { password: hashed } });
  return NextResponse.json({ ok: true });
}
