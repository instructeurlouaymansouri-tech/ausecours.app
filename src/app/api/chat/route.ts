import { NextRequest, NextResponse } from 'next/server';
import { AUSECOURS_SYSTEM_PROMPT } from '@/lib/safetyPrompt';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured on the server. Add it to .env.local.' },
      { status: 500 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (!messages.length) {
    return NextResponse.json({ error: 'messages[] is required.' }, { status: 400 });
  }

  const contents = messages.slice(-10).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: AUSECOURS_SYSTEM_PROMPT }] },
          contents,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'Gemini API error.' },
        { status: res.status }
      );
    }

    const text: string =
      data.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join('') ?? '';

    return NextResponse.json({ reply: text });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not reach Gemini API: ${(err as Error).message}` },
      { status: 502 }
    );
  }
}
