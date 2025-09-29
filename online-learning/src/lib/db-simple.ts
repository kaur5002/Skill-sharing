// lib/db-simple.ts - Simple in-memory database for testing
import { User } from '@/types/user';

// Simple in-memory storage (just for testing)
const users: User[] = [];

export class SimpleDatabase {
  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    const newUser = {
      ...userData,
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    users.push(newUser);
    console.log('✅ User created:', { email: newUser.email, role: newUser.role });
    return newUser;
  }

  static async findUserByEmail(email: string, role?: 'tutor' | 'learner') {
    const user = users.find(u => {
      if (role) {
        return u.email === email && u.role === role;
      }
      return u.email === email;
    });
    
    console.log('🔍 Looking for user:', { email, role, found: !!user });
    return user || null;
  }

  static async getAllUsers() {
    console.log('📋 All users:', users.length);
    return users;
  }
}