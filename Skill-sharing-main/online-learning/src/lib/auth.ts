// lib/auth.ts
import jwt from 'jsonwebtoken';
import { hash, verify } from 'argon2';

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password);
};

export const verifyPassword = async (hashedPassword: string, password: string): Promise<boolean> => {
  return await verify(hashedPassword, password);
};

export const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
};