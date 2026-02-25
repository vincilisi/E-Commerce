import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const adminPaths = [
  '/admin',
  '/app/admin',
  '/app/api/admin',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = adminPaths.some((path) => pathname.startsWith(path));
  if (!isAdminRoute) return NextResponse.next();

  const token = req.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const verified = await jwtVerify(token, new TextEncoder().encode(secret));
    if (verified.payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/app/admin/:path*', '/app/api/admin/:path*'],
};
