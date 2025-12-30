import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define paths that are always accessible
  const publicPaths = [
    '/signin',
    '/signup',
    '/reset-password',
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml'
  ];

  // Check if the path is public or a static resource
  const isPublicPath = publicPaths.includes(pathname) || 
                       pathname.startsWith('/_next') || 
                       pathname.startsWith('/static') || 
                       pathname.startsWith('/images') ||
                       pathname.startsWith('/api'); // Allow API routes (auth check inside if needed)

  const token = request.cookies.get('accessToken')?.value;

  // If path is public (like /signin) and user has token, redirect to dashboard
  // But don't redirect if it's an API route or static asset
  if (pathname === '/signin' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If path is protected and user has no token, redirect to signin
  if (!isPublicPath && !token) {
    const url = new URL('/signin', request.url);
    // Optionally preserve the original URL to redirect back after login
    // url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
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
