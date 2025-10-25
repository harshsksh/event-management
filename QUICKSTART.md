# Quick Start Guide

Get up and running with the Event Management App in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add:

```env
MONGODB_URI=mongodb://localhost:27017/event-management
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=supersecretkey123456789012345678
NODE_ENV=development
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
- Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `MONGODB_URI` in `.env`

### 4. Seed Demo Users (Optional)

```bash
npm run seed
```

This creates:
- **Organizer**: organizer@example.com / password123
- **Attendee**: attendee@example.com / password123

### 5. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## First Steps

### As an Organizer

1. **Sign Up** at `/auth/signup` with role "Organize events"
2. Go to **Dashboard**
3. Click **"Create New Event"**
4. Fill in event details
5. Click **"Create Event"**

### As an Attendee

1. **Sign Up** at `/auth/signup` with role "Attend events"
2. Browse **Events** at `/events`
3. Click on an event to view details
4. Click **"Register for Event"**
5. View your registrations in **Dashboard**

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

# Database
npm run seed             # Seed demo users
```

## Project Structure

```
event-management/
├── app/                 # Next.js pages and API routes
│   ├── api/            # API endpoints
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   ├── events/         # Event pages
│   └── page.tsx        # Home page
├── components/          # React components
├── lib/                # Utilities and config
├── models/             # Database models
└── types/              # TypeScript types
```

## Key Features

✅ **User Authentication** - Sign up, login, logout  
✅ **Role-Based Access** - Organizer and Attendee roles  
✅ **Event Management** - Create, edit, delete events  
✅ **Event Registration** - RSVP system with capacity limits  
✅ **User Dashboards** - Manage events or registrations  
✅ **Responsive Design** - Works on all devices  

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in (via NextAuth)

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event (organizers)
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event (organizer)
- `DELETE /api/events/[id]` - Delete event (organizer)

### RSVPs
- `POST /api/events/[id]/rsvp` - Register for event
- `DELETE /api/events/[id]/rsvp` - Cancel registration

### User
- `GET /api/user/registrations` - Get user's registrations

## Troubleshooting

### "Cannot connect to MongoDB"
- Check if MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

### "NextAuth configuration error"
- Ensure `NEXTAUTH_URL` is set correctly
- Generate a new `NEXTAUTH_SECRET` if needed

### "Module not found"
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Port 3000 already in use
```bash
# Kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Next Steps

1. **Customize** - Update branding, colors, and content
2. **Deploy** - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Contribute** - See [CONTRIBUTING.md](./CONTRIBUTING.md)
4. **API Docs** - Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Need Help?

- 📖 Read the full [README.md](./README.md)
- 🐛 Report issues on GitHub
- 💬 Join discussions
- 📧 Contact maintainers

---

**Happy Event Managing! 🎉**

