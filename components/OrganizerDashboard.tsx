'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import EventForm from './EventForm';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity?: number;
  attendeeCount: number;
}

export default function OrganizerDashboard() {
  const searchParams = useSearchParams();
  const editEventId = searchParams.get('edit');
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  useEffect(() => {
    if (editEventId) {
      const event = events.find(e => e.id === editEventId);
      if (event) {
        setEditingEvent(event);
        setShowForm(true);
      }
    }
  }, [editEventId, events]);

  const fetchMyEvents = async () => {
    try {
      const response = await fetch('/api/events?filter=my-events');
      const data = await response.json();

      if (response.ok) {
        setEvents(data.events);
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = () => {
    setShowForm(false);
    setEditingEvent(null);
    fetchMyEvents();
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMyEvents();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete event');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your events</p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Create New Event'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 card">
          <h2 className="text-2xl font-bold mb-6">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <EventForm
            event={editingEvent}
            onSuccess={handleEventCreated}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">Loading your events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 card">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first event.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Create Event
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const past = isPastEvent(event.date);
            return (
              <div
                key={event.id}
                className={`card ${past ? 'opacity-60' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      {past && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                          Past Event
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📅 {formatDate(event.date)} at {event.time}</span>
                      <span>📍 {event.location}</span>
                      <span>
                        👥 {event.attendeeCount}
                        {event.capacity && ` / ${event.capacity}`} attendees
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="btn btn-secondary text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="btn btn-danger text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

