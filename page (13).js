import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserById, safeUser } from '@/lib/store';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });
  const user = getUserById(session.sub);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: safeUser(user) });
}
