export interface Vote {
  visitorId: string;
  questionIndex: number;
  choice: 'mom' | 'dad';
}

export interface GameState {
  currentQuestionIndex: number;
  showQRCode: boolean;
  questions: string[];
  votes: Vote[];
  isGameActive: boolean;
  momName: string;
  dadName: string;
}

export interface VoteTally {
  mom: number;
  dad: number;
  total: number;
  momPercentage: number;
  dadPercentage: number;
}

export const DEFAULT_QUESTIONS: string[] = [
  'Who will be the first to change a diaper?',
  'Who will be the stricter parent?',
  'Who will baby get the most kisses from?',
  'Who will panic more?',
  'Who will will get more sleep in the first 10 days?',
  'Who will be better at getting the baby to sleep?',
  'Who is more likely to end up playing with baby toys themselves?',
  'Who will be ready to go on a date night without the baby first?',
  'Who will cry more on the first day of daycare?',
  'Who will teach the baby to say their first word?',
  'Who will tell the baby the most bedtime stories?',
  'Who will love the baby the most?'
];
