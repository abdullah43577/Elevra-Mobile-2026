export const CONTENT_COLORS = {
  note: "#5B47E8", // matches secondary-500 — the app's core brand color
  recording: "#D6653D",
  resume: "#0F9B7A",
} as const;

export type ContentType = keyof typeof CONTENT_COLORS;
