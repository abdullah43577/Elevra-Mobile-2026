import { Ionicons } from "@expo/vector-icons";

export const CONTENT_COLORS = {
  note: "#5B47E8", // matches secondary-500 — the app's core brand color
  recording: "#D6653D",
  resume: "#0F9B7A",
  application: "#2E6FD1",
  profile: "#B23A6B",
  letter: "#A8761C",
  interview: "#1B7A99",
} as const;

export type ContentType = keyof typeof CONTENT_COLORS;

export const CONTENT_META = {
  Note: {
    color: CONTENT_COLORS.note,
    label: "Note",
    icon: "document-text-outline",
    plural: "Notes",
  },
  Recording: {
    color: CONTENT_COLORS.recording,
    label: "Recording",
    icon: "mic-outline",
    plural: "Recordings",
  },
  Resume: {
    color: CONTENT_COLORS.resume,
    label: "Resume",
    icon: "document-outline",
    plural: "Resumes",
  },
  Application: {
    color: CONTENT_COLORS.application,
    label: "Application",
    icon: "briefcase-outline",
    plural: "Applications",
  },
  CoverLetter: {
    color: CONTENT_COLORS.letter,
    label: "Cover letter",
    icon: "mail-outline",
    // "Letters", not "Cover letters" — this is a tile caption sharing a row
    // with four others, and the long form wraps.
    plural: "Letters",
  },
  InterviewQuestion: {
    color: CONTENT_COLORS.interview,
    label: "Interview answer",
    icon: "chatbubbles-outline",
    plural: "Answers",
  },
} as const satisfies Record<
  string,
  {
    color: string;
    // Singular, for a row that names one item. The key is not usable as copy —
    // "CoverLetter" is not something to show a user.
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    plural: string;
  }
>;

export type ContentCategory = keyof typeof CONTENT_META;

/*
  The bridge between the two vocabularies: CONTENT_META is keyed by the model
  name a result or activity row carries, while the theme's per-scheme colours are
  keyed by the accent name. Anything that needs a *scheme-aware* colour —
  useThemeColors().contentTint — has to cross from one to the other, since
  CONTENT_META.color is the light-mode hex only.
*/
export const CONTENT_TYPE_BY_CATEGORY = {
  Note: "note",
  Recording: "recording",
  Resume: "resume",
  Application: "application",
  CoverLetter: "letter",
  InterviewQuestion: "interview",
} as const satisfies Record<ContentCategory, ContentType>;
