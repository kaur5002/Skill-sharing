// lib/database.ts
import clientPromise from './mongodb';
import { User } from '@/types/user';
import { ObjectId } from 'mongodb';

export class DatabaseService {
  private static async getDb() {
    const client = await clientPromise;
    return client.db('skillshare');
  }

  // User operations
  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
      console.log('🏗️ DatabaseService.createUser called');
      const db = await this.getDb();
      console.log('📊 Database connection established');
      const users = db.collection('users');
      console.log('👥 Users collection accessed');
      
      const newUser = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      console.log('📝 User data prepared:', { ...newUser, password: '[hidden]' });

      const result = await users.insertOne(newUser);
      console.log('✅ User inserted with ID:', result.insertedId);
      return { ...newUser, _id: result.insertedId };
    } catch (error) {
      console.error('❌ Error in createUser:', error);
      throw error;
    }
  }

  static async findUserByEmail(email: string, role?: 'tutor' | 'learner') {
    try {
      console.log('🔍 DatabaseService.findUserByEmail called for:', email, role ? `with role: ${role}` : '');
      const db = await this.getDb();
      console.log('📊 Database connection established');
      const users = db.collection('users');
      
      const query: any = { email };
      if (role) query.role = role;
      console.log('🔎 Query:', query);
      
      const user = await users.findOne(query);
      console.log('📋 Query result:', user ? 'User found' : 'User not found');
      return user;
    } catch (error) {
      console.error('❌ Error in findUserByEmail:', error);
      throw error;
    }
  }

  static async findUserById(id: string) {
    const db = await this.getDb();
    const users = db.collection('users');
    
    return await users.findOne({ _id: new ObjectId(id) });
  }

  static async updateUser(id: string, updateData: Partial<User>) {
    const db = await this.getDb();
    const users = db.collection('users');
    
    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
    
    return result;
  }

  static async deleteUser(id: string) {
    const db = await this.getDb();
    const users = db.collection('users');
    
    return await users.deleteOne({ _id: new ObjectId(id) });
  }

  // Collection helpers
  static async getAllUsers(role?: 'tutor' | 'learner') {
    const db = await this.getDb();
    const users = db.collection('users');
    
    const query = role ? { role } : {};
    return await users.find(query).toArray();
  }

  // Course operations (for future)
  static async createCourse(courseData: any) {
    const db = await this.getDb();
    const courses = db.collection('courses');
    
    const newCourse = {
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await courses.insertOne(newCourse);
    return { ...newCourse, _id: result.insertedId };
  }
}