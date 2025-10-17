import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export type AuthUser = {
  userId: string;
  email: string;
  role: 'tutor' | 'learner';
};

export function getAuthUser(req: NextRequest): AuthUser | null {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  const token = parts[1];
  const decoded = verifyToken(token) as any;
  if (!decoded) return null;
  return { userId: decoded.userId, email: decoded.email, role: decoded.role };
}
