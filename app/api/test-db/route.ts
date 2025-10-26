import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Event from '@/models/Event';

export async function GET() {
  try {
    await dbConnect();
    
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: '✅ Connected to MongoDB successfully!',
      database: process.env.MONGODB_URI?.split('/')[3] || 'event-management',
      stats: {
        users: userCount,
        events: eventCount,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionString: process.env.MONGODB_URI ? 'Set' : 'Missing'
    }, { status: 500 });
  }
}

