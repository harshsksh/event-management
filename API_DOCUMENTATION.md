# API Documentation

Complete documentation for all API endpoints in the Event Management Application.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses NextAuth.js for authentication. Most endpoints require a valid session cookie obtained through the sign-in process.

### Headers

For authenticated requests, NextAuth automatically handles session cookies. No manual header configuration is needed when using the built-in fetch API in client components.

## Response Format

All API responses follow this general structure:

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [ ... ] // Optional validation errors
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Endpoints

### Authentication

#### Sign Up
Create a new user account.

```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "name": "string (required, max 60 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "role": "string (required, enum: 'organizer' | 'attendee')"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created successfully",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Errors:**
- `400` - Validation error or user already exists
- `500` - Server error

---

#### Sign In
Handled by NextAuth.js. Use the built-in sign-in page or the `signIn()` function from `next-auth/react`.

```typescript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'user@example.com',
  password: 'password123',
  redirect: false,
});
```

---

### Events

#### Get All Events
Retrieve a list of events based on filters.

```http
GET /api/events?filter={filter}
```

**Query Parameters:**
- `filter` (optional): 
  - `public` - Public upcoming events
  - `my-events` - Current user's created events (requires auth)
  - `upcoming` - All upcoming events

**Response:** `200 OK`
```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "date": "ISO 8601 date string",
      "time": "string (HH:MM format)",
      "location": "string",
      "capacity": "number | null",
      "isPublic": "boolean",
      "attendeeCount": "number",
      "organizer": {
        "id": "string",
        "name": "string",
        "email": "string"
      },
      "createdAt": "ISO 8601 date string",
      "updatedAt": "ISO 8601 date string"
    }
  ]
}
```

**Errors:**
- `500` - Server error

---

#### Create Event
Create a new event (Organizers only).

```http
POST /api/events
```

**Authentication:** Required (Organizer role)

**Request Body:**
```json
{
  "title": "string (required, max 100 chars)",
  "description": "string (required, max 2000 chars)",
  "date": "string (required, ISO date format YYYY-MM-DD)",
  "time": "string (required, HH:MM format)",
  "location": "string (required, max 200 chars)",
  "capacity": "number (optional, min 1)",
  "isPublic": "boolean (optional, default true)"
}
```

**Response:** `201 Created`
```json
{
  "message": "Event created successfully",
  "event": {
    "id": "string",
    "title": "string",
    "description": "string",
    "date": "ISO 8601 date string",
    "time": "string",
    "location": "string",
    "capacity": "number | null",
    "isPublic": "boolean",
    "organizer": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
}
```

**Errors:**
- `400` - Validation error
- `401` - Not authenticated
- `403` - Not an organizer
- `500` - Server error

---

#### Get Single Event
Retrieve detailed information about a specific event.

```http
GET /api/events/{id}
```

**URL Parameters:**
- `id` (required) - Event ID

**Response:** `200 OK`
```json
{
  "event": {
    "id": "string",
    "title": "string",
    "description": "string",
    "date": "ISO 8601 date string",
    "time": "string",
    "location": "string",
    "capacity": "number | null",
    "isPublic": "boolean",
    "organizer": {
      "id": "string",
      "name": "string",
      "email": "string"
    },
    "attendees": [
      {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    ],
    "attendeeCount": "number",
    "createdAt": "ISO 8601 date string",
    "updatedAt": "ISO 8601 date string"
  }
}
```

**Errors:**
- `404` - Event not found
- `500` - Server error

---

#### Update Event
Update an existing event (must be event organizer).

```http
PUT /api/events/{id}
```

**Authentication:** Required (Event organizer only)

**URL Parameters:**
- `id` (required) - Event ID

**Request Body:** (all fields optional)
```json
{
  "title": "string (max 100 chars)",
  "description": "string (max 2000 chars)",
  "date": "string (ISO date format)",
  "time": "string (HH:MM format)",
  "location": "string (max 200 chars)",
  "capacity": "number (min 1)",
  "isPublic": "boolean"
}
```

**Response:** `200 OK`
```json
{
  "message": "Event updated successfully",
  "event": {
    "id": "string",
    "title": "string",
    "description": "string",
    "date": "ISO 8601 date string",
    "time": "string",
    "location": "string",
    "capacity": "number | null",
    "isPublic": "boolean"
  }
}
```

**Errors:**
- `400` - Validation error
- `401` - Not authenticated
- `403` - Not event organizer
- `404` - Event not found
- `500` - Server error

---

#### Delete Event
Delete an event (must be event organizer).

```http
DELETE /api/events/{id}
```

**Authentication:** Required (Event organizer only)

**URL Parameters:**
- `id` (required) - Event ID

**Response:** `200 OK`
```json
{
  "message": "Event deleted successfully"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Not event organizer
- `404` - Event not found
- `500` - Server error

---

### RSVPs (Event Registrations)

#### Register for Event
Register (RSVP) for an event.

```http
POST /api/events/{id}/rsvp
```

**Authentication:** Required

**URL Parameters:**
- `id` (required) - Event ID

**Response:** `200 OK`
```json
{
  "message": "Successfully registered for event"
}
```

**Errors:**
- `400` - Already registered, event is full, or event is in the past
- `401` - Not authenticated
- `404` - Event not found
- `500` - Server error

---

#### Cancel Registration
Cancel event registration.

```http
DELETE /api/events/{id}/rsvp
```

**Authentication:** Required

**URL Parameters:**
- `id` (required) - Event ID

**Response:** `200 OK`
```json
{
  "message": "Successfully cancelled registration"
}
```

**Errors:**
- `401` - Not authenticated
- `404` - RSVP not found
- `500` - Server error

---

### User

#### Get User Registrations
Get current user's event registrations.

```http
GET /api/user/registrations
```

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "registrations": [
    {
      "id": "string",
      "status": "string (attending | not_attending | maybe)",
      "event": {
        "id": "string",
        "title": "string",
        "description": "string",
        "date": "ISO 8601 date string",
        "time": "string",
        "location": "string",
        "organizer": {
          "name": "string",
          "email": "string"
        }
      },
      "createdAt": "ISO 8601 date string"
    }
  ]
}
```

**Errors:**
- `401` - Not authenticated
- `500` - Server error

---

## Example Usage

### JavaScript/TypeScript

```typescript
// Sign up a new user
const signUpResponse = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'organizer',
  }),
});
const signUpData = await signUpResponse.json();

// Get all upcoming events
const eventsResponse = await fetch('/api/events?filter=upcoming');
const eventsData = await eventsResponse.json();

// Create an event (requires authentication)
const createEventResponse = await fetch('/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Tech Meetup',
    description: 'Monthly tech meetup for developers',
    date: '2024-12-15',
    time: '18:00',
    location: 'Tech Hub, 123 Main St',
    capacity: 50,
    isPublic: true,
  }),
});
const createEventData = await createEventResponse.json();

// Register for an event
const rsvpResponse = await fetch('/api/events/EVENT_ID/rsvp', {
  method: 'POST',
});
const rsvpData = await rsvpResponse.json();

// Get user's registrations
const registrationsResponse = await fetch('/api/user/registrations');
const registrationsData = await registrationsResponse.json();
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting using packages like `next-rate-limit` or similar.

## Pagination

Currently, all list endpoints return all matching records. For production use with large datasets, implement pagination:

```http
GET /api/events?page=1&limit=10
```

## Filtering and Sorting

Future enhancements could include:
- Search by title/description
- Filter by date range
- Filter by location
- Sort by date, popularity, etc.

Example:
```http
GET /api/events?search=tech&startDate=2024-01-01&endDate=2024-12-31&sort=date
```

## Webhooks

Currently not implemented. Future versions could include webhooks for:
- New event registrations
- Event updates
- Event cancellations

---

**Version:** 1.0.0  
**Last Updated:** 2024

