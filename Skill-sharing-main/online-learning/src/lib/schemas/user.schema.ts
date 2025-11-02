// lib/schemas/user.schema.ts
import { z } from 'zod';

// User schema for database operations
export const userSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['tutor', 'learner']),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  
  // Additional user fields
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  isVerified: z.boolean().default(false),
});

// Derived schemas
export const createUserSchema = userSchema.omit({ 
  _id: true, 
  createdAt: true, 
  updatedAt: true,
  avatar: true,
  bio: true,
  skills: true,
  rating: true,
  isVerified: true
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['tutor', 'learner'], {
    message: 'Please select a role',
  }),
});

export const updateUserSchema = userSchema.partial().omit({ 
  _id: true, 
  email: true, 
  password: true 
});

export const userResponseSchema = userSchema.omit({ 
  password: true 
});

// Types
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;

// Course schema for future use
export const courseSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tutorId: z.string(),
  category: z.string(),
  price: z.number().min(0),
  duration: z.number().min(1), // in hours
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  thumbnail: z.string().url().optional(),
  isPublished: z.boolean().default(false),
  enrolledStudents: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Course = z.infer<typeof courseSchema>;