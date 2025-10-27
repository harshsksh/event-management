# Event Management Application

A full-stack event management platform built with Next.js that allows users to create, manage, and register for events. Features role-based authentication, real-time updates, and a responsive UI.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)

## 🌟 Features

### Role-Based Access Control
- **Organizers**: Create, edit, delete events; manage attendees; set capacity limits
- **Attendees**: Browse events, register/RSVP, manage registrations
- **Public**: View upcoming events without authentication

### Core Functionality
- Secure authentication with NextAuth.js
- Event CRUD operations with capacity management
- Dynamic RSVP system with registration tracking
- Responsive design for all devices
- RESTful API with TypeScript

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file in the root directory:

```env
# MongoDB Connection (Local or Atlas)
MONGODB_URI=mongodb://localhost:27017/event-management

# NextAuth Configuration
# For Vercel: Leave NEXTAUTH_URL empty or use: https://your-app.vercel.app
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-32-chars-minimum

# App Configuration
NODE_ENV=development
```

**Generate NEXTAUTH_SECRET**: Use [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) or `openssl rand -base64 32`

**For MongoDB Atlas**: Replace connection string with your cluster URI

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Test Database Connection

Visit [http://localhost:3000/api/test-db](http://localhost:3000/api/test-db) to verify MongoDB connection

## 📁 Project Structure

```
event-management/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   ├── dashboard/         # User dashboard
│   └── events/            # Event pages
├── components/            # React components
├── lib/                   # Utilities
├── models/                # Database models
└── types/                 # TypeScript types
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event (organizers)
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event (owner)
- `DELETE /api/events/[id]` - Delete event (owner)

### RSVPs
- `POST /api/events/[id]/rsvp` - Register
- `DELETE /api/events/[id]/rsvp` - Cancel

### User
- `GET /api/user/registrations` - Get user's RSVPs

## 🎯 User Flows

### Organizer Flow
1. Sign up with organizer role
2. Go to dashboard
3. Create new event
4. View/edit/delete events
5. Monitor attendee registrations

### Attendee Flow
1. Sign up with attendee role
2. Browse events at `/events`
3. View event details
4. Register for event
5. Manage registrations in dashboard

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (production URL)
   - `NEXTAUTH_SECRET`
4. Deploy!

## 📝 Database Schema

```typescript
// User
{ name, email, password(hashed), role, timestamps }

// Event
{ title, description, date, time, location, organizer, attendees[], capacity, isPublic, timestamps }

// RSVP
{ event, user, status, timestamps }
```

## 🧪 Development

```bash
npm run dev    # Start dev server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run linter
```

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 👤 Author

**Harsh Yadav**

- GitHub: [@harshsksh](https://github.com/harshsksh)
- LinkedIn: [Harsh Yadav](https://www.linkedin.com/in/harsh-yadav-218370272/)
- Email: hr392002@gmail.com

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Built using Next.js and TypeScript**
