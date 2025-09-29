// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { verifyPassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/schemas/user.schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔑 Login request:', { ...body, password: '[hidden]' });
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password, role } = validation.data;

    // Find user using MongoDB database
    const user = await DatabaseService.findUserByEmail(email, role);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(user.password, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id!.toString(), user.email, user.role);

    // Return success response (without password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}