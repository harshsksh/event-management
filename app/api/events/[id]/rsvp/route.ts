import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import RSVP from '@/models/RSVP';
import { authOptions } from '@/lib/auth';

// POST - RSVP to an event (attendees only)
export async function POST(
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

    // Check if event is in the past
    if (new Date(event.date) < new Date()) {
      return NextResponse.json(
        { error: 'Cannot RSVP to past events' },
        { status: 400 }
      );
    }

    // Check capacity
    if (event.capacity && event.attendees.length >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is at full capacity' },
        { status: 400 }
      );
    }

    // Check if already registered
    const existingRSVP = await RSVP.findOne({
      event: params.id,
      user: session.user.id,
    });

    if (existingRSVP) {
      return NextResponse.json(
        { error: 'You have already registered for this event' },
        { status: 400 }
      );
    }

    // Create RSVP
    await RSVP.create({
      event: params.id,
      user: session.user.id,
      status: 'attending',
    });

    // Add user to event attendees
    await Event.findByIdAndUpdate(params.id, {
      $addToSet: { attendees: session.user.id },
    });

    return NextResponse.json({
      message: 'Successfully registered for event',
    });
  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel RSVP
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

    // Delete RSVP
    const rsvp = await RSVP.findOneAndDelete({
      event: params.id,
      user: session.user.id,
    });

    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      );
    }

    // Remove user from event attendees
    await Event.findByIdAndUpdate(params.id, {
      $pull: { attendees: session.user.id },
    });

    return NextResponse.json({
      message: 'Successfully cancelled registration',
    });
  } catch (error) {
    console.error('Cancel RSVP error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    );
  }
}

