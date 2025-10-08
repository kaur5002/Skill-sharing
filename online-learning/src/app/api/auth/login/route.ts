// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { verifyPassword, generateToken } from '@/lib/auth';
import { LoginRequest } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Login API called');
    const body = await request.json();
    console.log('🔑 Login request:', { ...body, password: '[hidden]' });
    
    // Basic validation
    const { email, password, role } = body as LoginRequest;
    
    if (!email || !password || !role) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user using MongoDB database
    console.log('🔍 Looking for user with email:', email, 'and role:', role);
    const user = await DatabaseService.findUserByEmail(email, role);
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('🔐 Verifying password');
    const isValidPassword = await verifyPassword(user.password, password);
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    console.log('🎫 Generating JWT token');
    const token = generateToken(user._id!.toString(), user.email, user.role);

    // Return success response (without password)
    const { password: _, ...userWithoutPassword } = user;
    console.log('🎉 Login successful for user:', userWithoutPassword._id);
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Error stack:', (error as Error).stack);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}