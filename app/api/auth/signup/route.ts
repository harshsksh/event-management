import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(60, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['organizer', 'attendee']).default('attendee'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role,
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

