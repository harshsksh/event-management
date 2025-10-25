'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Registration {
  id: string;
  status: string;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    organizer: {
      name: string;
      email: string;
    };
  };
  createdAt: string;
}

export default function AttendeeDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/user/registrations');
      const data = await response.json();

      if (response.ok) {
        setRegistrations(data.registrations);
      } else {
        setError(data.error || 'Failed to fetch registrations');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!confirm('Are you sure you want to cancel your registration?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchRegistrations();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to cancel registration');
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

  const upcomingRegistrations = registrations.filter(
    (reg) => !isPastEvent(reg.event.date)
  );
  const pastRegistrations = registrations.filter(
    (reg) => isPastEvent(reg.event.date)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Registrations</h1>
          <p className="mt-2 text-gray-600">View and manage your event registrations</p>
        </div>
        <Link href="/events" className="btn btn-primary">
          Browse Events
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">Loading your registrations...</div>
      ) : registrations.length === 0 ? (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't registered for any events yet.
          </p>
          <div className="mt-6">
            <Link href="/events" className="btn btn-primary">
              Browse Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingRegistrations.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Upcoming Events ({upcomingRegistrations.length})
              </h2>
              <div className="space-y-4">
                {upcomingRegistrations.map((registration) => (
                  <div key={registration.id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <Link
                          href={`/events/${registration.event.id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {registration.event.title}
                        </Link>
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {registration.event.description}
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-gray-500">
                          <div>
                            📅 {formatDate(registration.event.date)} at {registration.event.time}
                          </div>
                          <div>📍 {registration.event.location}</div>
                          <div>
                            👤 Organized by {registration.event.organizer.name}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleCancelRegistration(registration.event.id)}
                          className="btn btn-danger text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastRegistrations.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Past Events ({pastRegistrations.length})
              </h2>
              <div className="space-y-4">
                {pastRegistrations.map((registration) => (
                  <div key={registration.id} className="card opacity-60">
                    <Link
                      href={`/events/${registration.event.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {registration.event.title}
                    </Link>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {registration.event.description}
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-gray-500">
                      <div>
                        📅 {formatDate(registration.event.date)} at {registration.event.time}
                      </div>
                      <div>📍 {registration.event.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

