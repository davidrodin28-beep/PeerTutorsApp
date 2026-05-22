import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserByEmail, safeUser } from '@/lib/store';
import { signToken, setAuthCookie } from '@/lib/auth';
import { SCHOOLS } from '@/lib/constants';

export async function POST(req) {
  try {
    const { name, email, password, role, school, subjects } = await req.json();

    if (!name?.trim() || !email?.trim() || !password || !role || !school) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }
    if (!['student', 'tutor'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }
    if (!SCHOOLS.find((s) => s.id === school)) {
      return NextResponse.json({ error: 'Invalid school.' }, { status: 400 });
    }
    if (getUserByEmail(email.toLowerCase())) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      school,
      subjects: Array.isArray(subjects) ? subjects : [],
    });

    const token = await signToken({ sub: user.id, email: user.email });
    const res = NextResponse.json({ user: safeUser(user) }, { status: 201 });
    setAuthCookie(res, token);
    return res;
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
