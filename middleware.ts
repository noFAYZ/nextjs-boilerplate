import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected and public routes
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/subscription'];
const authRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow API routes to pass through
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals to pass through
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if user has a session cookie
  const sessionCookie = request.cookies.get('better-auth.session_token')?.value ||
  request.cookies.get('authjs.session-token')?.value ||
  request.cookies.get('session')?.value ||
  request.cookies.get('auth.session-token')?.value;
  const isAuthenticated = !!sessionCookie;

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle auth routes - redirect authenticated users away
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Security headers for all responses
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CSP header for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:;"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};