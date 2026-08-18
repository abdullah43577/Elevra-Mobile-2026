export type InterviewCategory =
  | "BACKGROUND"
  | "BEHAVIOURAL"
  | "SITUATIONAL"
  | "MOTIVATION"
  | "STRENGTHS"
  | "CLOSING";

export type AnswerStatus = "DRAFT" | "NEEDS_WORK" | "READY";

export interface InterviewAnswer {
  id: string;
  userId: string;
  questionId: string;
  text?: string | null;
  audioUrl?: string | null;
  audioDuration?: number | null;
  status: AnswerStatus;
  practiceCount: number;
  lastPracticedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/*
  `userId` is null for the seeded catalogue and set for a question the user wrote
  themselves — which is also the only kind they may edit or delete.

  `answers` is the current user's answer joined on, as an array of at most one
  because that is the shape Prisma returns for a filtered relation. Read it
  through `answerOf()` rather than indexing at call sites.
*/
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
  // Nullable, not just optional: JSON.stringify drops undefined keys, so
  // clearing a written answer has to send an explicit null.
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
