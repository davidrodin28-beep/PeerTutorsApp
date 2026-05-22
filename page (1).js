import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-peerbridge-change-in-production'
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('pb_token')?.value;

  if (pathname.startsWith('/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/auth', request.url));
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      const res = NextResponse.redirect(new URL('/auth', request.url));
      res.cookies.set('pb_token', '', { maxAge: 0 });
      return res;
    }
  }

  if (pathname === '/auth' && token) {
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.redirect(new URL('/dashboard/messages', request.url));
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/auth'] };
