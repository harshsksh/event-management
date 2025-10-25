'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              EventHub
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link
                href="/events"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/events')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Events
              </Link>
              
              {session?.user && (
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-gray-500">Loading...</div>
            ) : session?.user ? (
              <>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{session.user.name}</div>
                  <div className="text-gray-500 capitalize">{session.user.role}</div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn btn-secondary text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="btn btn-secondary text-sm">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

