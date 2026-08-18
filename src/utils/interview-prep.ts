import {
  InterviewAnswer,
  InterviewQuestion,
} from "../../types/interview-prep";

/*
  Prisma returns the current user's answer as a filtered relation, so it arrives
  as an array of at most one. Read it through here rather than indexing at call
  sites.
*/
export const answerOf = function (
  question: InterviewQuestion,
): InterviewAnswer | undefined {
  return question.answers?.[0];
};

export const hasWrittenAnswer = function (question: InterviewQuestion) {
  return !!answerOf(question)?.text?.trim();
};

/*
  The order the practice runner uses, and the reason this feature is a tool
  rather than a list.

  Questions you have never touched come first, then the ones you flagged as
  needing work, then whatever you have rehearsed least recently. The effect is
  that the questions you keep avoiding are exactly the ones it puts in front of
  you — the opposite of a browsable bank, where you re-read the answers you are
  already comfortable with.
*/
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

  // Never rehearsed sorts ahead of anything that has been.
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

/** Seeded questions belong to the catalogue and are read-only for everyone. */
export const isCustomQuestion = function (question: InterviewQuestion) {
  return !!question.userId;
};
