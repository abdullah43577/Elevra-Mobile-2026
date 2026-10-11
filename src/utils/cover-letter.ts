import { format } from "date-fns";
import { CoverLetter } from "../../types/cover-letter";

export const DEFAULT_GREETING_NAME = "Hiring Manager";
export const FALLBACK_CLOSING = "Sincerely,";

// Shared by the on-screen letter and the exported PDF so the two cannot disagree.

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
  if (Number.isNaN(date.getTime())) return "";

  return format(date, "d MMMM yyyy");
};
