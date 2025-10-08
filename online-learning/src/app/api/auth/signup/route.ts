// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { hashPassword, generateToken } from '@/lib/auth';
import { SignupRequest } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Signup API called');
    const body = await request.json();
    console.log('📝 Signup request:', { ...body, password: '[hidden]' });
    
    // Basic validation
    const { name, email, password, role } = body as SignupRequest;
    
    if (!name || !email || !password || !role) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      console.log('❌ Password too short');
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    if (!['tutor', 'learner'].includes(role)) {
      console.log('❌ Invalid role');
      return NextResponse.json(
        { success: false, message: 'Role must be tutor or learner' },
        { status: 400 }
      );
    }

    // Check if user already exists with any role
    console.log('🔍 Checking if user exists with email:', email);
    const existingUser = await DatabaseService.findUserByEmail(email);
    if (existingUser) {
      console.log('❌ User already exists');
      return NextResponse.json(
        { success: false, message: `An account with this email already exists` },
        { status: 409 }
      );
    }

    // Hash password
    console.log('🔐 Hashing password');
    const hashedPassword = await hashPassword(password);

    // Create user using MongoDB database
    console.log('💾 Creating user in database');
    const newUser = await DatabaseService.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log('✅ User created successfully:', newUser._id);

    // Generate token
    console.log('🎫 Generating JWT token');
    const token = generateToken(newUser._id!.toString(), email, role);

    // Return success response (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    console.log('🎉 Signup successful for user:', userWithoutPassword._id);
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: userWithoutPassword,
      token,
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Signup error:', error);
    console.error('❌ Error stack:', (error as Error).stack);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}