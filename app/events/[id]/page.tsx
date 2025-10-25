'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity?: number;
  attendeeCount: number;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  attendees: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [params.id, session]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setEvent(data.event);
        
        // Check if user is registered
        if (session?.user) {
          const registered = data.event.attendees.some(
            (attendee: any) => attendee.id === session.user.id
          );
          setIsRegistered(registered);
        }
      } else {
        setError(data.error || 'Failed to fetch event');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/events/${params.id}`);
      return;
    }

    setActionLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/events/${params.id}/rsvp`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully registered for event!');
        setIsRegistered(true);
        fetchEvent(); // Refresh event data
      } else {
        setError(data.error || 'Failed to register');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    setActionLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/events/${params.id}/rsvp`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully cancelled registration');
        setIsRegistered(false);
        fetchEvent(); // Refresh event data
      } else {
        setError(data.error || 'Failed to cancel registration');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOrganizer = session?.user && event?.organizer.id === session.user.id;
  const canRegister = session?.user && session.user.role !== 'organizer' && !isRegistered;
  const isPastEvent = event && new Date(event.date) < new Date();
  const isFull = event?.capacity && event.attendeeCount >= event.capacity;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading event...</div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Event not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/events" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
        ← Back to Events
      </Link>

      <div className="card">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          
          {isOrganizer && (
            <Link
              href={`/dashboard?edit=${event.id}`}
              className="btn btn-secondary text-sm"
            >
              Edit Event
            </Link>
          )}
        </div>

        <div className="prose max-w-none mb-8">
          <p className="text-gray-700 text-lg">{event.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Date</p>
                <p className="text-gray-600">{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Time</p>
                <p className="text-gray-600">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Organizer</p>
                <p className="text-gray-600">{event.organizer.name}</p>
                <p className="text-sm text-gray-500">{event.organizer.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Attendance</p>
                <p className="text-gray-600">
                  {event.attendeeCount}
                  {event.capacity && ` / ${event.capacity}`} registered
                </p>
                {isFull && !isRegistered && (
                  <p className="text-sm text-red-600 mt-1">Event is full</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isPastEvent && (
          <div className="border-t border-gray-200 pt-6">
            {!session && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Sign in to register for this event</p>
                <Link href={`/auth/signin?callbackUrl=/events/${params.id}`} className="btn btn-primary">
                  Sign In
                </Link>
              </div>
            )}

            {canRegister && !isFull && (
              <button
                onClick={handleRSVP}
                disabled={actionLoading}
                className="w-full btn btn-primary"
              >
                {actionLoading ? 'Registering...' : 'Register for Event'}
              </button>
            )}

            {isRegistered && (
              <div className="text-center">
                <p className="text-green-600 font-medium mb-4">
                  ✓ You are registered for this event
                </p>
                <button
                  onClick={handleCancelRSVP}
                  disabled={actionLoading}
                  className="btn btn-danger"
                >
                  {actionLoading ? 'Cancelling...' : 'Cancel Registration'}
                </button>
              </div>
            )}

            {isOrganizer && (
              <div className="text-center">
                <p className="text-primary-600 font-medium">You are the organizer of this event</p>
              </div>
            )}

            {canRegister && isFull && (
              <div className="text-center">
                <p className="text-red-600 font-medium">This event is at full capacity</p>
              </div>
            )}
          </div>
        )}

        {isPastEvent && (
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-gray-500 font-medium">This event has already passed</p>
          </div>
        )}
      </div>
    </div>
  );
}

