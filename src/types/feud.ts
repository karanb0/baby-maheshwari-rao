export interface FeudAnswer {
  text: string;
  points: number;
}

export interface FeudCategoryData {
  id: string;
  title: string;
  answers: FeudAnswer[];
}

export interface FeudState {
  categories: FeudCategoryData[];
  currentCategoryIndex: number;
  activeTeam: 1 | 2;
  teamNames: [string, string];
  scores: [number, number];
  roundPoints: [number, number];
  stealMode: boolean;
  strikes: number;
  revealedAnswers: Record<string, number[]>;
}
