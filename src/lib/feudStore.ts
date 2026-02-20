import { FeudState, FeudCategoryData } from '@/types/feud';
import categoriesJson from '@/data/familyFeud.json';

const categories: FeudCategoryData[] = categoriesJson.categories;

let feudState: FeudState = {
  categories,
  currentCategoryIndex: 0,
  activeTeam: 1,
  teamNames: ['Team 1', 'Team 2'],
  scores: [0, 0],
  roundPoints: [0, 0],
  stealMode: false,
  strikes: 0,
  revealedAnswers: {},
};

export function getFeudState(): FeudState {
  return {
    ...feudState,
    scores: [...feudState.scores] as [number, number],
    roundPoints: [...feudState.roundPoints] as [number, number],
    teamNames: [...feudState.teamNames] as [string, string],
    revealedAnswers: { ...feudState.revealedAnswers },
  };
}

export function revealAnswer(categoryId: string, answerIndex: number, awardPoints = true): FeudState {
  const category = feudState.categories.find(c => c.id === categoryId);
  if (!category || answerIndex < 0 || answerIndex >= category.answers.length) {
    return getFeudState();
  }

  const revealed = feudState.revealedAnswers[categoryId] || [];
  if (revealed.includes(answerIndex)) {
    return getFeudState();
  }

  feudState.revealedAnswers[categoryId] = [...revealed, answerIndex];

  if (awardPoints) {
    const teamIdx = feudState.activeTeam - 1;
    const otherIdx = feudState.activeTeam === 1 ? 1 : 0;

    if (feudState.stealMode) {
      // Steal: active team takes all of the other team's round points + this answer's points
      feudState.roundPoints[teamIdx] += feudState.roundPoints[otherIdx] + category.answers[answerIndex].points;
      feudState.roundPoints[otherIdx] = 0;
      feudState.stealMode = false;
    } else {
      feudState.roundPoints[teamIdx] += category.answers[answerIndex].points;
    }
  }

  return getFeudState();
}

export function markWrong(): FeudState {
  if (feudState.strikes < 3) {
    feudState.strikes += 1;
  }
  return getFeudState();
}

export function switchTeam(): FeudState {
  feudState.activeTeam = feudState.activeTeam === 1 ? 2 : 1;
  feudState.strikes = 0;
  return getFeudState();
}

export function toggleStealMode(): FeudState {
  feudState.stealMode = !feudState.stealMode;
  return getFeudState();
}

export function bankRound(): FeudState {
  feudState.scores[0] += feudState.roundPoints[0];
  feudState.scores[1] += feudState.roundPoints[1];
  feudState.roundPoints = [0, 0];
  feudState.stealMode = false;
  feudState.strikes = 0;
  return getFeudState();
}

export function setCategory(index: number): FeudState {
  feudState.currentCategoryIndex = Math.max(0, Math.min(index, feudState.categories.length - 1));
  feudState.strikes = 0;
  return getFeudState();
}

export function setTeamNames(name1: string, name2: string): FeudState {
  feudState.teamNames = [name1, name2];
  return getFeudState();
}

export function resetStrikes(): FeudState {
  feudState.strikes = 0;
  return getFeudState();
}

export function resetFeud(): FeudState {
  feudState = {
    categories,
    currentCategoryIndex: 0,
    activeTeam: 1,
    teamNames: feudState.teamNames,
    scores: [0, 0],
    roundPoints: [0, 0],
    stealMode: false,
    strikes: 0,
    revealedAnswers: {},
  };
  return getFeudState();
}
