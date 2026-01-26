export interface Question {
  id: string;
  text: string;
}

export interface Vote {
visitorId: string;
  questionId: string;
  choice: 'mom' | 'dad';
}

export interface GameState {
  currentQuestionIndex: number;
  showQRCode: boolean;
  questions: Question[];
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

export const DEFAULT_QUESTIONS: Question[] = [
  { id: '1', text: 'Who will be the first to change a diaper?' },
  { id: '2', text: 'Who will be the stricter parent?' },
  { id: '3', text: 'Who will spoil the baby more?' },
  { id: '4', text: 'Who will be better at getting the baby to sleep?' },
  { id: '5', text: 'Who will cry more on the first day of school?' },
  { id: '6', text: 'Who will be more protective?' },
  { id: '7', text: 'Who will teach the baby to say their first word?' },
  { id: '8', text: 'Who will be the fun parent?' },
  { id: '9', text: 'Who will give in to puppy dog eyes first?' },
  { id: '10', text: 'Who will tell the baby the most bedtime stories?' },
];
