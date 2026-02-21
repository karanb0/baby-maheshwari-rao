import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correct = password === process.env.ADMIN_PASSWORD;
    return NextResponse.json({ authenticated: correct });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
