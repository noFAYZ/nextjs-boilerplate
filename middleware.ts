import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from "better-auth/cookies";
// Define protected and public routes
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/subscription'];
const authRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password'];
const onboardingRoute = '/onboarding';

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

/*   const sessionCookie = getSessionCookie(request, {
    cookieName: "better-auth.session_token",
    cookiePrefix: "__Secure-"
}); */
const cookiePrefix = process.env.NODE_ENV === 'production' ? '__Secure-' : '';
const sessionCookie = getSessionCookie(request, {
  cookieName: `${cookiePrefix}better-auth.session_token`
});

console.log("Session cookie:",sessionCookie,cookiePrefix)
  // Check if user has a session cookie
  // ✅ CRITICAL: In production (secure: true), cookies have __Secure- prefix
  // In development (secure: false), cookies don't have the prefix
/*   const sessionCookie =
    // Production cookies (with __Secure- prefix)
    request.cookies.get('__Secure-better-auth.session_data')?.value || request.cookies.get('__Secure-better-auth.session_token')?.value ||
    request.cookies.get('__Host-better-auth.session_token')?.value ||
    // Development cookies (without prefix)
    request.cookies.get('better-auth.session_token')?.value ||
    // Fallback to other possible cookie names
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('session')?.value ||
    request.cookies.get('auth.session-token')?.value; */
  const isAuthenticated = !!sessionCookie;

  // Handle onboarding route - allow access for authenticated users only
  if (pathname === onboardingRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // Allow access to onboarding
    return NextResponse.next();
  }

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
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Remove server information
  response.headers.set('Server', '');
  response.headers.set('X-Powered-By', '');
  
  // CSP header for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; connect-src 'self' https: wss:; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self';"
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