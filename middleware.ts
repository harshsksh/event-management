import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/auth/signin',
  },
});

// Protect these routes
export const config = {
  matcher: ['/dashboard/:path*'],
};

