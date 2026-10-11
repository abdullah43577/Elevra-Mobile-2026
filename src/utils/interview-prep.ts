import {
  InterviewAnswer,
  InterviewQuestion,
} from "../../types/interview-prep";

export const answerOf = function (
  question: InterviewQuestion,
): InterviewAnswer | undefined {
  return question.answers?.[0];
};

export const hasWrittenAnswer = function (question: InterviewQuestion) {
  return !!answerOf(question)?.text?.trim();
};

const focusRank = function (question: InterviewQuestion) {
  const answer = answerOf(question);

  if (!answer) return 0;
  if (answer.status === "NEEDS_WORK") return 1;
  if (answer.status === "DRAFT") return 2;
  return 3;
};

export const byFocus = function (
  a: InterviewQuestion,
  b: InterviewQuestion,
): number {
  const rankDelta = focusRank(a) - focusRank(b);
  if (rankDelta !== 0) return rankDelta;

  const aPractised = answerOf(a)?.lastPracticedAt;
  const bPractised = answerOf(b)?.lastPracticedAt;

  if (!aPractised && bPractised) return -1;
  if (aPractised && !bPractised) return 1;
  if (aPractised && bPractised) {
    return new Date(aPractised).getTime() - new Date(bPractised).getTime();
  }

  return a.sortOrder - b.sortOrder;
};

export const buildPracticeSet = function (
  questions: InterviewQuestion[],
  size: number | null,
) {
  const ordered = [...questions].sort(byFocus);
  return size ? ordered.slice(0, size) : ordered;
};

export const formatDuration = function (totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const isCustomQuestion = function (question: InterviewQuestion) {
  return !!question.userId;
};
