export type QuestionStatus = 'correct' | 'incorrect' | 'skipped';

export interface QuestionResult {
  questionNumber: string;
  answerKey: string;
  userAnswer: string;
  acceptedAnswers: string[];
  status: QuestionStatus;
}

export interface GradedAttempt {
  id: string;
  testId: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  mode: string;
  userAnswers: Record<string, string>;
  gradingDetails?: {
    questionResults?: Record<string, QuestionResult>;
  };
}

export interface AttemptSummary {
  id: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  mode: string;
  createdAt: string;
}
