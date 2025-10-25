import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: 'organizer' | 'attendee';
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'organizer' | 'attendee';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'organizer' | 'attendee';
  }
}

