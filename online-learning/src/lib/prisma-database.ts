// lib/prisma-database.ts
import { prisma } from './prisma';
import { User } from '@/types/user';

export class PrismaDatabaseService {
  // User operations
  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      console.log('🏗️ PrismaDatabaseService.createUser called');
      console.log('📝 User data prepared:', { ...userData, password: '[hidden]' });

      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role,
        },
      });

      console.log('✅ User created with ID:', newUser.id);
      
      // Convert Prisma user to your User type format
      return {
        _id: newUser.id,
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        role: newUser.role as 'tutor' | 'learner',
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };
    } catch (error) {
      console.error('❌ Error in createUser:', error);
      throw error;
    }
  }

  static async findUserByEmail(email: string, role?: 'tutor' | 'learner') {
    try {
      console.log('🔍 PrismaDatabaseService.findUserByEmail called for:', email, role ? `with role: ${role}` : '');
      
      const whereClause: any = { email };
      if (role) whereClause.role = role;
      
      console.log('🔎 Query:', whereClause);
      
      const user = await prisma.user.findFirst({
        where: whereClause,
      });
      
      console.log('📋 Query result:', user ? 'User found' : 'User not found');
      
      if (!user) return null;
      
      // Convert Prisma user to your User type format
      return {
        _id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role as 'tutor' | 'learner',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('❌ Error in findUserByEmail:', error);
      throw error;
    }
  }

  static async findUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      
      if (!user) return null;
      
      // Convert Prisma user to your User type format
      return {
        _id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role as 'tutor' | 'learner',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('❌ Error in findUserById:', error);
      throw error;
    }
  }

  static async updateUser(id: string, updateData: Partial<User>) {
    try {
      const result = await prisma.user.update({
        where: { id },
        data: {
          ...(updateData.email && { email: updateData.email }),
          ...(updateData.password && { password: updateData.password }),
          ...(updateData.name && { name: updateData.name }),
          ...(updateData.role && { role: updateData.role }),
        },
      });
      
      return { modifiedCount: 1, acknowledged: true };
    } catch (error) {
      console.error('❌ Error in updateUser:', error);
      throw error;
    }
  }

  static async deleteUser(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      });
      
      return { deletedCount: 1, acknowledged: true };
    } catch (error) {
      console.error('❌ Error in deleteUser:', error);
      throw error;
    }
  }

  // Collection helpers
  static async getAllUsers(role?: 'tutor' | 'learner') {
    try {
      const whereClause = role ? { role: role } : {};
      
      const users = await prisma.user.findMany({
        where: whereClause,
      });
      
      // Convert Prisma users to your User type format
      return users.map((user: any) => ({
        _id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role as 'tutor' | 'learner',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error) {
      console.error('❌ Error in getAllUsers:', error);
      throw error;
    }
  }

  // Course operations (for future) - keeping the same interface
  static async createCourse(courseData: any) {
    // This would need a Course model in your Prisma schema
    // For now, just returning the courseData with timestamps
    const newCourse = {
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Implement with Prisma Course model when ready
    console.log('⚠️ createCourse not yet implemented with Prisma - Course model needed');
    return newCourse;
  }
}