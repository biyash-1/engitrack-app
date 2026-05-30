import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Retrieve the accessToken cookie set by our backend
  const accessToken = request.cookies.get('accessToken')?.value;

  // Define route matchers
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/subscription');

  // 2. If user is visiting a protected route and doesn't have an access token, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);

    return NextResponse.redirect(loginUrl);
  }

  // 3. If user is authenticated and tries to visit /login or /register, redirect to dashboard
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify matching paths for optimization
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/subscription/:path*',
    '/login',
    '/register',
  ],
};
