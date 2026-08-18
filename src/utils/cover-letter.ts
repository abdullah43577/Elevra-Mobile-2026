import { format } from "date-fns";
import { CoverLetter } from "../../types/cover-letter";

export const DEFAULT_GREETING_NAME = "Hiring Manager";
export const FALLBACK_CLOSING = "Sincerely,";

/*
  Everything the letter derives from its stored fields lives here, so the
  on-screen preview and the exported PDF cannot disagree.

  The resume pair (ResumeBody and resume-html.ts) has to be kept in sync by
  hand and says so in §15. This one does not, and should not be allowed to
  regress into that.
*/

/*
  Every newline starts a new paragraph and runs of blank lines collapse.

  People separate paragraphs with either one blank line or none, and a plain
  textarea is not somewhere anyone hard-wraps prose — so treating each line as a
  paragraph matches both habits without making the user guess which we want.
*/
export const toParagraphs = function (body: string) {
  return body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
};

export const letterGreeting = function (letter: {
  recipientName?: string | null;
}) {
  return `Dear ${letter.recipientName?.trim() || DEFAULT_GREETING_NAME},`;
};

export const letterClosing = function (letter: { closing?: string | null }) {
  return letter.closing?.trim() || FALLBACK_CLOSING;
};

export const letterRecipientLines = function (letter: {
  recipientName?: string | null;
  recipientTitle?: string | null;
  company?: string;
  companyAddress?: string | null;
}) {
  return [
    letter.recipientName,
    letter.recipientTitle,
    letter.company,
    ...(letter.companyAddress ?? "").split(/\n+/),
  ]
    .map((line) => (line ?? "").trim())
    .filter(Boolean);
};

export const letterSenderName = function (letter: Pick<CoverLetter, "personalInfo">) {
  return [letter.personalInfo?.firstName, letter.personalInfo?.lastName]
    .filter(Boolean)
    .join(" ");
};

export const formatLetterDate = function (value?: string) {
  if (!value) return "";

  const date = new Date(value);
  // An unparseable date must not take the whole export down with it.
  if (Number.isNaN(date.getTime())) return "";

  return format(date, "d MMMM yyyy");
};
