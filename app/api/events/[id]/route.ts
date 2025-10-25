import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { authOptions } from '@/lib/auth';

const eventUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(2000).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date').optional(),
  time: z.string().min(1).optional(),
  location: z.string().min(1).max(200).optional(),
  capacity: z.number().min(1).optional(),
  isPublic: z.boolean().optional(),
});

// GET single event by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const event = await Event.findById(params.id)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email')
      .lean();

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Format event for response
    const formattedEvent = {
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      capacity: event.capacity,
      isPublic: event.isPublic,
      organizer: {
        id: (event as any).organizer._id.toString(),
        name: (event as any).organizer.name,
        email: (event as any).organizer.email,
      },
      attendees: (event as any).attendees.map((attendee: any) => ({
        id: attendee._id.toString(),
        name: attendee.name,
        email: attendee.email,
      })),
      attendeeCount: (event as any).attendees.length,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    return NextResponse.json({ event: formattedEvent });
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT update event (organizer only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the event organizer can update this event' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = eventUpdateSchema.parse(body);

    // Update event
    const updateData: any = { ...validatedData };
    if (validatedData.date) {
      updateData.date = new Date(validatedData.date);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');

    return NextResponse.json({
      message: 'Event updated successfully',
      event: {
        id: updatedEvent!._id.toString(),
        title: updatedEvent!.title,
        description: updatedEvent!.description,
        date: updatedEvent!.date,
        time: updatedEvent!.time,
        location: updatedEvent!.location,
        capacity: updatedEvent!.capacity,
        isPublic: updatedEvent!.isPublic,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE event (organizer only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the event organizer can delete this event' },
        { status: 403 }
      );
    }

    await Event.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

