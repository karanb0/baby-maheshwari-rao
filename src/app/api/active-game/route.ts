import { NextRequest, NextResponse } from 'next/server';
import { getActiveGame, setActiveGame, ActiveGame } from '@/lib/activeGameStore';

export async function GET() {
  return NextResponse.json({ activeGame: getActiveGame() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { game } = body as { game: ActiveGame };

    if (game !== 'shoe' && game !== 'feud') {
      return NextResponse.json({ error: 'Invalid game type' }, { status: 400 });
    }

    const result = setActiveGame(game);
    return NextResponse.json({ activeGame: result });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
