// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { hashPassword, generateToken } from '@/lib/auth';
import { createUserSchema } from '@/lib/schemas/user.schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Signup request:', { ...body, password: '[hidden]' });
    
    // Validate input using the correct schema
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      console.log('❌ Validation failed:', validation.error.issues);
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password, role } = validation.data;

    // Check if user already exists with any role
    const existingUser = await DatabaseService.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: `An account with this email already exists` },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user using MongoDB database
    const newUser = await DatabaseService.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate token
    const token = generateToken(newUser._id!.toString(), email, role);

    // Return success response (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: userWithoutPassword,
      token,
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}