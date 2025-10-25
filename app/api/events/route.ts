import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(2000),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required').max(200),
  capacity: z.number().min(1).optional(),
  isPublic: z.boolean().default(true),
});

// GET all events (public or user-specific)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter'); // 'public', 'my-events', 'upcoming'
    const session = await getServerSession(authOptions);

    let query: any = {};

    if (filter === 'public') {
      query.isPublic = true;
      query.date = { $gte: new Date() };
    } else if (filter === 'my-events' && session?.user) {
      query.organizer = session.user.id;
    } else if (filter === 'upcoming') {
      query.date = { $gte: new Date() };
      if (!session) {
        query.isPublic = true;
      }
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ date: 1 })
      .lean();

    // Format events for response
    const formattedEvents = events.map((event: any) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      capacity: event.capacity,
      isPublic: event.isPublic,
      attendeeCount: event.attendees?.length || 0,
      organizer: {
        id: event.organizer._id.toString(),
        name: event.organizer.name,
        email: event.organizer.email,
      },
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST create new event (organizers only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'organizer') {
      return NextResponse.json(
        { error: 'Only organizers can create events' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = eventSchema.parse(body);

    await dbConnect();

    const event = await Event.create({
      ...validatedData,
      date: new Date(validatedData.date),
      organizer: session.user.id,
      attendees: [],
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email')
      .lean();

    return NextResponse.json(
      {
        message: 'Event created successfully',
        event: {
          id: populatedEvent!._id.toString(),
          title: populatedEvent!.title,
          description: populatedEvent!.description,
          date: populatedEvent!.date,
          time: populatedEvent!.time,
          location: populatedEvent!.location,
          capacity: populatedEvent!.capacity,
          isPublic: populatedEvent!.isPublic,
          organizer: (populatedEvent as any).organizer,
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

    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

