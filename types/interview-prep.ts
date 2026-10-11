export type InterviewCategory =
  | "BACKGROUND"
  | "BEHAVIOURAL"
  | "SITUATIONAL"
  | "MOTIVATION"
  | "STRENGTHS"
  | "ROLE_SPECIFIC"
  | "CLOSING";

export type AnswerStatus = "DRAFT" | "NEEDS_WORK" | "READY";

export interface InterviewAnswer {
  id: string;
  userId: string;
  questionId: string;
  text?: string | null;
  audioUrl?: string | null;
  audioDuration?: number | null;
  transcript?: string | null;
  feedback?: AnswerFeedback | null;
  status: AnswerStatus;
  practiceCount: number;
  lastPracticedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// `answers` is Prisma's filtered-relation shape: at most one, the current user's.
// Read it through answerOf().
export interface InterviewQuestion {
  id: string;
  text: string;
  category: InterviewCategory;
  guidance?: string | null;
  userId?: string | null;
  seedKey?: string | null;
  isActive: boolean;
  sortOrder: number;
  answers?: InterviewAnswer[];
  createdAt: string;
  updatedAt: string;
}

export interface InterviewPrepStats {
  byStatus: Record<AnswerStatus, number>;
  totalQuestions: number;
  answered: number;
  notStarted: number;
  practisedThisWeek: number;
}

export interface SaveAnswerRequest {
  // Nullable: JSON.stringify drops undefined keys, so clearing must send null.
  text?: string | null;
  status?: AnswerStatus;
}

export interface SaveQuestionRequest {
  text: string;
  category: InterviewCategory;
  guidance?: string;
}

export interface QuestionFilters {
  category?: InterviewCategory;
  status?: AnswerStatus;
  search?: string;
  applicationId?: string;
  unanswered?: boolean;
}

export interface GenerateQuestionsResult {
  questions: InterviewQuestion[];
  // Matched existing bank questions, pinned instead of duplicated.
  pinnedExisting: number;
  dropped: number;
}

// `tighterVersion` is absent when the rewrite added something the candidate did not say.
export interface AnswerFeedback {
  metrics: {
    wordCount: number;
    durationSeconds: number | null;
    wordsPerMinute: number | null;
    pace: "slow" | "steady" | "fast" | null;
    fillerCount: number;
    fillers: { word: string; count: number }[];
    length: "short" | "good" | "long" | "too_long" | null;
  };
  structure: {
    applies: boolean;
    situation?: boolean;
    task?: boolean;
    action?: boolean;
    result?: boolean;
  };
  specificity: "concrete" | "mixed" | "vague";
  strongest: string;
  biggestFix: string;
  tighterVersion?: string;
  generatedAt: string;
}
