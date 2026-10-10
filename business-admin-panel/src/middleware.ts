import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/lib/serverAuth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, internal Next.js files, and image icons
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') || // matches .ico, .png, .jpg, .svg, .css, .js
    pathname === '/favicon.ico' ||
    pathname === '/icon.png' ||
    pathname === '/apple-icon.png'
  ) {
    return NextResponse.next();
  }

  // 2. Prepare mutable response for cookie synchronization
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createMiddlewareSupabaseClient(request, response);

  // 3. Authenticate user from 12-hour session cookies
  const { data: { user } } = await supabase.auth.getUser();

  const isPublicRoute =
    pathname === '/login' ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/api/auth/logout') ||
    pathname === '/unauthorized';

  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/api/admin');

  // Case A: User is already logged in
  if (user) {
    // If authenticated user visits root ('/') or '/login', redirect directly to '/dashboard'
    if (pathname === '/' || pathname === '/login') {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      dashboardUrl.search = '';
      return NextResponse.redirect(dashboardUrl);
    }
    // Allow request to proceed with synchronized cookies
    return response;
  }

  // Case B: User is NOT logged in
  if (isProtectedRoute) {
    // Block protected API routes with 401 Unauthorized
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required' },
        { status: 401 }
      );
    }

    // Redirect protected dashboard page requests to /login
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user visits root '/' while unauthenticated, redirect to '/login'
  if (pathname === '/') {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, apple-icon.png
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)',
  ],
};
