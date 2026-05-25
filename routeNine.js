import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAllUsers, getUserById, safeUser } from '@/lib/store';

export async function GET(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q      = searchParams.get('q')?.toLowerCase() ?? '';
  const role   = searchParams.get('role') ?? '';
  const school = searchParams.get('school') ?? '';

  let users = getAllUsers()
    .filter((u) => u.id !== session.sub) // exclude self
    .map(safeUser);

  if (q) {
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.subjects ?? []).some((s) => s.toLowerCase().includes(q))
    );
  }
  if (role)   users = users.filter((u) => u.role === role);
  if (school) users = users.filter((u) => u.school === school);

  return NextResponse.json({ users });
}
