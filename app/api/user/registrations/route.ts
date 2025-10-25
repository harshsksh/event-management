import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import RSVP from '@/models/RSVP';
import { authOptions } from '@/lib/auth';

// GET user's event registrations
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const rsvps = await RSVP.find({ user: session.user.id })
      .populate({
        path: 'event',
        populate: {
          path: 'organizer',
          select: 'name email',
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    const registrations = rsvps
      .filter((rsvp: any) => rsvp.event) // Filter out RSVPs for deleted events
      .map((rsvp: any) => ({
        id: rsvp._id.toString(),
        status: rsvp.status,
        event: {
          id: rsvp.event._id.toString(),
          title: rsvp.event.title,
          description: rsvp.event.description,
          date: rsvp.event.date,
          time: rsvp.event.time,
          location: rsvp.event.location,
          organizer: {
            name: rsvp.event.organizer.name,
            email: rsvp.event.organizer.email,
          },
        },
        createdAt: rsvp.createdAt,
      }));

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

