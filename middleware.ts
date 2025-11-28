import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Handle auth code on any page - redirect to callback
    const code = request.nextUrl.searchParams.get('code');
    if (code && !request.nextUrl.pathname.startsWith('/auth/callback')) {
      const callbackUrl = new URL('/auth/callback', request.url);
      callbackUrl.searchParams.set('code', code);
      // Preserve other params like 'next' or 'type'
      const type = request.nextUrl.searchParams.get('type');
      if (type) callbackUrl.searchParams.set('type', type);
      console.log('[Middleware] Redirecting auth code to callback:', callbackUrl.toString());
      return NextResponse.redirect(callbackUrl);
    }

    // Check for Supabase auth tokens in cookies
    // Supabase uses multiple cookie patterns, check for the most common ones
    const cookies = request.cookies;

    // Check for any Supabase auth-related cookies
    // Common patterns: sb-{project-ref}-auth-token, sb-access-token, sb-refresh-token
    let hasSession = false;

    // Try to find auth token by iterating through cookie names
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token',
    ];

    // Check if any of the standard Supabase auth cookies exist
    for (const cookieName of cookieNames) {
      if (cookies.get(cookieName)) {
        hasSession = true;
        break;
      }
    }

    // If standard cookies not found, check for project-specific pattern
    // by looking at all cookies (Edge Runtime compatible approach)
    if (!hasSession) {
      // Get all cookies and check for sb-*-auth-token pattern
      const allCookies = cookies.getAll();
      console.log('🍪 [Middleware] All cookies:', allCookies.map(c => c.name).join(', ') || 'NONE');
      hasSession = allCookies.some(cookie =>
        cookie.name.includes('sb-') &&
        cookie.name.includes('auth-token') &&
        !cookie.name.includes('code-verifier')
      );
      console.log('🔐 [Middleware] Has session:', hasSession, 'for path:', request.nextUrl.pathname);
    }

    // Protected routes check
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/chat') ||
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/dashboard');

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register');

    // Redirect to login if accessing protected route without authentication
    if (isProtectedRoute && !hasSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to chat if accessing auth routes with active authentication
    if (isAuthRoute && hasSession) {
      return NextResponse.redirect(new URL('/chat', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Log error for debugging but don't block the request
    console.error('Middleware error:', error);
    // Allow request to continue even if middleware fails
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};