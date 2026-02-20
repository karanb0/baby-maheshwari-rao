export type ActiveGame = 'shoe' | 'feud';

let activeGame: ActiveGame = 'shoe';

export function getActiveGame(): ActiveGame {
  return activeGame;
}

export function setActiveGame(game: ActiveGame): ActiveGame {
  activeGame = game;
  return activeGame;
}
