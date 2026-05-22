import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/auth';
import { getConversationById, addMessage, getMessages } from '@/lib/store';

export async function GET(req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

  const convo = getConversationById(params.id);
  if (!convo) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  if (!convo.participants.includes(session.sub)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  return NextResponse.json({ messages: getMessages(params.id) });
}

export async function POST(req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

  const convo = getConversationById(params.id);
  if (!convo) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  if (!convo.participants.includes(session.sub)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });

  const msg = addMessage({
    id: uuidv4(),
    conversationId: params.id,
    senderId: session.sub,
    text: text.trim(),
  });

  return NextResponse.json({ message: msg }, { status: 201 });
}
