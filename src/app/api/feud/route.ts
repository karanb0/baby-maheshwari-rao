import { NextRequest, NextResponse } from 'next/server';
import {
  getFeudState,
  revealAnswer,
  markWrong,
  switchTeam,
  toggleStealMode,
  bankRound,
  setCategory,
  setTeamNames,
  resetStrikes,
  resetFeud,
} from '@/lib/feudStore';

export async function GET() {
  const state = getFeudState();
  return NextResponse.json(state);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    let state;

    switch (action) {
      case 'revealAnswer':
        state = revealAnswer(params.categoryId, params.answerIndex, params.awardPoints ?? true);
        break;
      case 'markWrong':
        state = markWrong();
        break;
      case 'switchTeam':
        state = switchTeam();
        break;
      case 'toggleStealMode':
        state = toggleStealMode();
        break;
      case 'bankRound':
        state = bankRound();
        break;
      case 'setCategory':
        state = setCategory(params.index);
        break;
      case 'setTeamNames':
        state = setTeamNames(params.name1, params.name2);
        break;
      case 'resetStrikes':
        state = resetStrikes();
        break;
      case 'resetFeud':
        state = resetFeud();
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
