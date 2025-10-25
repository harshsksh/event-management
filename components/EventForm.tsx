'use client';

import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity?: number;
}

interface EventFormProps {
  event?: Event | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      // Format date for input field (YYYY-MM-DD)
      const dateObj = new Date(event.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      
      setFormData({
        title: event.title,
        description: event.description,
        date: formattedDate,
        time: event.time,
        location: event.location,
        capacity: event.capacity?.toString() || '',
      });
    }
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        isPublic: true,
      };

      if (formData.capacity) {
        payload.capacity = parseInt(formData.capacity);
      }

      const url = event ? `/api/events/${event.id}` : '/api/events';
      const method = event ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(data.error || 'Failed to save event');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="label">
          Event Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="input"
          placeholder="Summer Tech Conference 2024"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="input"
          placeholder="Describe your event..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="label">
            Date *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className="input"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label htmlFor="time" className="label">
            Time *
          </label>
          <input
            id="time"
            name="time"
            type="time"
            required
            className="input"
            value={formData.time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="label">
          Location *
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          className="input"
          placeholder="123 Main St, City, State"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="capacity" className="label">
          Capacity (Optional)
        </label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          min="1"
          className="input"
          placeholder="Leave empty for unlimited"
          value={formData.capacity}
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500 mt-1">
          Maximum number of attendees allowed
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex-1"
        >
          {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

