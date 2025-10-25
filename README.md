# Event Management Web Application

A full-stack event management platform built with Next.js that allows users to create, manage, and register for events. Features role-based authentication, real-time updates, and a responsive user interface.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure sign up and login with NextAuth.js
- **Role-Based Access Control**: Separate features for Organizers and Attendees
- **Event Management**: Full CRUD operations for events (Organizers only)
- **Event Registration (RSVP)**: Attendees can register and manage their registrations
- **Public Event Viewing**: Unauthenticated users can browse upcoming events
- **Capacity Management**: Set event capacity limits and track attendance
- **Real-time Updates**: Dynamic event lists and registration status

### User Roles

#### Organizers
- Create, edit, and delete events
- View all their managed events in dashboard
- Track attendee registrations
- Set event capacity limits

#### Attendees
- Browse and search for events
- Register (RSVP) for events
- View and manage their registrations in dashboard
- Cancel registrations

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **RESTful API**: Clean API architecture with proper HTTP methods
- **Data Validation**: Input validation with Zod
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Beautiful interface with Tailwind CSS

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18.x or higher
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/event-management.git
cd event-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/event-management
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# App Configuration
NODE_ENV=development
```

**Important**: 
- For `NEXTAUTH_SECRET`, generate a secure random string. You can use: `openssl rand -base64 32`
- If using MongoDB Atlas, replace the connection string with your cluster's connection string

### 4. Start MongoDB

If using local MongoDB:

```bash
mongod
```

If using MongoDB Atlas, ensure your IP address is whitelisted in the Network Access settings.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 👤 Demo Credentials

You can use these demo accounts or create your own:

### Organizer Account
- **Email**: organizer@example.com
- **Password**: password123

### Attendee Account
- **Email**: attendee@example.com
- **Password**: password123

**Note**: To create demo accounts, either:
1. Use the Sign Up page to create new accounts
2. Or manually insert them into your MongoDB database

## 📁 Project Structure

```
event-management/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/   # NextAuth configuration
│   │   │   └── signup/          # User registration
│   │   ├── events/              # Event CRUD operations
│   │   │   ├── [id]/            # Single event operations
│   │   │   │   ├── route.ts     # GET, PUT, DELETE event
│   │   │   │   └── rsvp/        # RSVP operations
│   │   │   └── route.ts         # GET all events, POST create
│   │   └── user/                # User-specific data
│   │       └── registrations/   # User's event registrations
│   ├── auth/                    # Authentication pages
│   │   ├── signin/              # Sign in page
│   │   └── signup/              # Sign up page
│   ├── dashboard/               # User dashboard
│   ├── events/                  # Event pages
│   │   └── [id]/                # Event detail page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── AttendeeDashboard.tsx    # Attendee dashboard view
│   ├── EventForm.tsx            # Event creation/edit form
│   ├── Navbar.tsx               # Navigation bar
│   ├── OrganizerDashboard.tsx   # Organizer dashboard view
│   └── Providers.tsx            # Context providers
├── lib/                         # Utility functions
│   ├── auth.ts                  # NextAuth configuration
│   └── mongodb.ts               # Database connection
├── models/                      # Mongoose models
│   ├── Event.ts                 # Event schema
│   ├── RSVP.ts                  # RSVP schema
│   └── User.ts                  # User schema
├── types/                       # TypeScript type definitions
│   └── next-auth.d.ts          # NextAuth type extensions
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🔌 API Endpoints

### Authentication

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "organizer" // or "attendee"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "organizer"
  }
}
```

#### POST `/api/auth/signin`
Sign in (handled by NextAuth - use the UI)

### Events

#### GET `/api/events?filter={filter}`
Get events list.

**Query Parameters:**
- `filter`: `public` | `my-events` | `upcoming`

**Response:**
```json
{
  "events": [
    {
      "id": "event_id",
      "title": "Tech Conference 2024",
      "description": "Annual tech conference",
      "date": "2024-12-01T00:00:00.000Z",
      "time": "10:00",
      "location": "Convention Center",
      "capacity": 100,
      "attendeeCount": 45,
      "organizer": {
        "id": "organizer_id",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### POST `/api/events`
Create a new event (Organizers only).

**Authentication Required**: Yes (Organizer role)

**Request Body:**
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual tech conference for developers",
  "date": "2024-12-01",
  "time": "10:00",
  "location": "Convention Center",
  "capacity": 100,
  "isPublic": true
}
```

**Response:**
```json
{
  "message": "Event created successfully",
  "event": {
    "id": "event_id",
    "title": "Tech Conference 2024",
    ...
  }
}
```

#### GET `/api/events/[id]`
Get a single event by ID.

**Response:**
```json
{
  "event": {
    "id": "event_id",
    "title": "Tech Conference 2024",
    "description": "Annual tech conference",
    "date": "2024-12-01T00:00:00.000Z",
    "time": "10:00",
    "location": "Convention Center",
    "capacity": 100,
    "organizer": {
      "id": "organizer_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "attendees": [
      {
        "id": "user_id",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ],
    "attendeeCount": 1
  }
}
```

#### PUT `/api/events/[id]`
Update an event (Organizer only - must be event creator).

**Authentication Required**: Yes (Event organizer)

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "date": "2024-12-02",
  "time": "14:00",
  "location": "New Location",
  "capacity": 150
}
```

#### DELETE `/api/events/[id]`
Delete an event (Organizer only - must be event creator).

**Authentication Required**: Yes (Event organizer)

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

### RSVPs (Event Registrations)

#### POST `/api/events/[id]/rsvp`
Register for an event.

**Authentication Required**: Yes

**Response:**
```json
{
  "message": "Successfully registered for event"
}
```

#### DELETE `/api/events/[id]/rsvp`
Cancel event registration.

**Authentication Required**: Yes

**Response:**
```json
{
  "message": "Successfully cancelled registration"
}
```

### User

#### GET `/api/user/registrations`
Get current user's event registrations.

**Authentication Required**: Yes

**Response:**
```json
{
  "registrations": [
    {
      "id": "rsvp_id",
      "status": "attending",
      "event": {
        "id": "event_id",
        "title": "Tech Conference 2024",
        "description": "Annual tech conference",
        "date": "2024-12-01T00:00:00.000Z",
        "time": "10:00",
        "location": "Convention Center",
        "organizer": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      },
      "createdAt": "2024-11-01T00:00:00.000Z"
    }
  ]
}
```

## 🎨 User Interface

### Pages

1. **Home Page** (`/`)
   - Hero section with call-to-action
   - Feature highlights
   - Public event showcase

2. **Events List** (`/events`)
   - Browse all upcoming public events
   - Event cards with key information
   - Quick registration access

3. **Event Details** (`/events/[id]`)
   - Full event information
   - Organizer details
   - Attendee list
   - Registration/cancellation buttons
   - Edit/delete options (for organizers)

4. **Sign In** (`/auth/signin`)
   - Email and password authentication
   - Link to sign up page
   - Demo credentials display

5. **Sign Up** (`/auth/signup`)
   - User registration form
   - Role selection (Organizer/Attendee)
   - Auto-login after registration

6. **Dashboard** (`/dashboard`)
   - **Organizer View**: Manage events, create new events, view analytics
   - **Attendee View**: View and manage event registrations

## 🔒 Access Control

### Public Routes
- `/` - Home page
- `/events` - Events list
- `/events/[id]` - Event details
- `/auth/signin` - Sign in
- `/auth/signup` - Sign up

### Protected Routes
- `/dashboard` - Requires authentication

### Role-Based Features

**Organizers:**
- Create events
- Edit their own events
- Delete their own events
- View event attendees

**Attendees:**
- Register for events
- Cancel registrations
- View their registrations

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub

2. Visit [Vercel](https://vercel.com) and import your repository

3. Configure environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`

4. Deploy!

### Alternative Deployment Options

- **Netlify**: Similar to Vercel with environment variable configuration
- **Railway**: Full-stack deployment with MongoDB included
- **Heroku**: Traditional platform with MongoDB add-on
- **AWS/Google Cloud**: More control but requires additional configuration

## 🧪 Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

```bash
npm run lint
```

## 📝 Database Schema

### User
```typescript
{
  name: string;
  email: string (unique);
  password: string (hashed);
  role: 'organizer' | 'attendee';
  createdAt: Date;
  updatedAt: Date;
}
```

### Event
```typescript
{
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: ObjectId (ref: User);
  attendees: ObjectId[] (ref: User);
  capacity?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### RSVP
```typescript
{
  event: ObjectId (ref: Event);
  user: ObjectId (ref: User);
  status: 'attending' | 'not_attending' | 'maybe';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- NextAuth.js for authentication solution
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database solution

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Built with ❤️ using Next.js and TypeScript**

