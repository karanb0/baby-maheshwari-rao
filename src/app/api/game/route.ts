import { NextRequest, NextResponse } from 'next/server';
import {
  getGameState,
  setCurrentQuestion,
  toggleQRCode,
  setGameActive,
  setParentNames,
  addVote,
  getVotesForQuestion,
  resetVotes,
  resetGame,
} from '@/lib/gameStore';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const questionIndex = searchParams.get('questionIndex');

  if (action === 'votes' && questionIndex != null) {
    const tally = getVotesForQuestion(Number(questionIndex));
    return NextResponse.json(tally);
  }

  const state = getGameState();
  return NextResponse.json(state);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    let state;

    switch (action) {
      case 'setQuestion':
        state = setCurrentQuestion(params.index);
        break;
      case 'toggleQR':
        state = toggleQRCode(params.show);
        break;
      case 'setActive':
        state = setGameActive(params.active);
        break;
      case 'setNames':
        state = setParentNames(params.momName, params.dadName);
        break;
      case 'vote':
        state = addVote(params.visitorId, params.questionIndex, params.choice);
        break;
      case 'resetVotes':
        state = resetVotes();
        break;
      case 'resetGame':
        state = resetGame();
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
