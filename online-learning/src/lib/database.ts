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
    const db = await this.getDb();
    const users = db.collection('users');
    
    const newUser = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  }

  static async findUserByEmail(email: string, role?: 'tutor' | 'learner') {
    const db = await this.getDb();
    const users = db.collection('users');
    
    const query: any = { email };
    if (role) query.role = role;
    
    return await users.findOne(query);
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