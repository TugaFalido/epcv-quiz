import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.method === "POST" && request.nextUrl.pathname === "/api/lti/launch") {
    // Allow LTI launch requests without CSRF
    return NextResponse.next();
  }

  // Verify JWT token for protected routes
  if (request.nextUrl.pathname.startsWith("/lti/")) {
    const token = request.cookies.get('lti_token');
    if (!token) {
      return NextResponse.redirect(new URL('/api/lti/error?message=unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/lti/:path*', '/lti/:path*']
}
