import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/auth';
import { getUserById, createNote, getVisibleNotes, safeUser } from '@/lib/store';
import { SUBJECTS } from '@/lib/constants';

export async function GET(req) {
  const session = await getSession();
  const viewer = session ? getUserById(session.sub) : null;

  const { searchParams } = new URL(req.url);
  const q       = searchParams.get('q')?.toLowerCase() ?? '';
  const subject = searchParams.get('subject') ?? '';
  const school  = searchParams.get('school') ?? '';

  let notes = getVisibleNotes(viewer);

  if (q)       notes = notes.filter((n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
  if (subject) notes = notes.filter((n) => n.subject === subject);
  if (school)  notes = notes.filter((n) => n.school === school);

  return NextResponse.json({ notes });
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

  const author = getUserById(session.sub);
  if (!author) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

  const body = await req.json();
  const { title, subject, description, fileName, fileType, visibility, allowedUserIds } = body;

  if (!title?.trim() || !subject || !description?.trim() || !visibility) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  if (!['public', 'school', 'private'].includes(visibility)) {
    return NextResponse.json({ error: 'Invalid visibility.' }, { status: 400 });
  }
  if (!SUBJECTS.includes(subject)) {
    return NextResponse.json({ error: 'Invalid subject.' }, { status: 400 });
  }

  const note = createNote({
    id: uuidv4(),
    title: title.trim(),
    subject,
    school: author.school,
    description: description.trim(),
    fileName: fileName ?? null,
    fileType: fileType ?? null,
    visibility,
    allowedUserIds: visibility === 'private' ? (allowedUserIds ?? []) : [],
    authorId: author.id,
    authorName: author.name,
  });

  return NextResponse.json({ note }, { status: 201 });
}
