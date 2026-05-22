import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, safeUser } from '@/lib/store';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await signToken({ sub: user.id, email: user.email });
    const res = NextResponse.json({ user: safeUser(user) });
    setAuthCookie(res, token);
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
