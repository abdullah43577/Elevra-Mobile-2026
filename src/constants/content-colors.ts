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
    icon: "document-text-outline",
    plural: "Notes",
  },
  Recording: {
    color: CONTENT_COLORS.recording,
    icon: "mic-outline",
    plural: "Recordings",
  },
  Resume: {
    color: CONTENT_COLORS.resume,
    icon: "document-outline",
    plural: "Resumes",
  },
  Application: {
    color: CONTENT_COLORS.application,
    icon: "briefcase-outline",
    plural: "Applications",
  },
} as const satisfies Record<
  string,
  {
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
    plural: string;
  }
>;

export type ContentCategory = keyof typeof CONTENT_META;
