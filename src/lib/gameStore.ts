import { GameState, Vote, DEFAULT_QUESTIONS, VoteTally } from '@/types/game';

// In-memory store (will reset on server restart - for production, use a database)
let gameState: GameState = {
  currentQuestionIndex: 0,
  showQRCode: true,
  questions: DEFAULT_QUESTIONS,
  votes: [],
  isGameActive: true,
  momName: 'Mom',
  dadName: 'Dad',
};

export function getGameState(): GameState {
  return { ...gameState };
}

export function setCurrentQuestion(index: number): GameState {
  gameState.currentQuestionIndex = Math.max(0, Math.min(index, gameState.questions.length - 1));
  return getGameState();
}

export function toggleQRCode(show: boolean): GameState {
  gameState.showQRCode = show;
  return getGameState();
}

export function setGameActive(active: boolean): GameState {
  gameState.isGameActive = active;
  return getGameState();
}

export function setParentNames(momName: string, dadName: string): GameState {
  gameState.momName = momName;
  gameState.dadName = dadName;
  return getGameState();
}

export function addVote(visitorId: string, questionId: string, choice: 'mom' | 'dad'): GameState {
  // Remove previous vote from this visitor for this question
  gameState.votes = gameState.votes.filter(
    v => !(v.visitorId === visitorId && v.questionId === questionId)
  );
  
  // Add new vote
  gameState.votes.push({ visitorId, questionId, choice });
  return getGameState();
}

export function getVotesForQuestion(questionId: string): VoteTally {
  const questionVotes = gameState.votes.filter(v => v.questionId === questionId);
  const momVotes = questionVotes.filter(v => v.choice === 'mom').length;
  const dadVotes = questionVotes.filter(v => v.choice === 'dad').length;
  const total = momVotes + dadVotes;
  
  return {
    mom: momVotes,
    dad: dadVotes,
    total,
    momPercentage: total > 0 ? (momVotes / total) * 100 : 50,
    dadPercentage: total > 0 ? (dadVotes / total) * 100 : 50,
  };
}

export function resetVotes(): GameState {
  gameState.votes = [];
  gameState.currentQuestionIndex = 0;
  return getGameState();
}

export function resetGame(): GameState {
  gameState = {
    currentQuestionIndex: 0,
    showQRCode: true,
    questions: DEFAULT_QUESTIONS,
    votes: [],
    isGameActive: true,
    momName: 'Mom',
    dadName: 'Dad',
  };
  return getGameState();
}
