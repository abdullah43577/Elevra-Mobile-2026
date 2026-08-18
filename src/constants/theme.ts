export type ColorScheme = "light" | "dark";
export type ThemePreference = "SYSTEM" | "LIGHT" | "DARK";

/*
  The same palette as the CSS variables in src/global.css, as hex, for the
  places a className cannot reach: Ionicons/lucide `color` props, ActivityIndicator,
  RefreshControl tints, StatusBar, and computed inline backgrounds.

  Edit both files together.
*/
export const THEME = {
  light: {
    canvas: "#FAFAFB",
    surface: "#FFFFFF",
    surfaceMuted: "#F3F3F6",
    line: "#EAEAEE",
    lineStrong: "#D5D5DE",
    foreground: "#17171A",
    foregroundMuted: "#7D7D8A",
    foregroundSubtle: "#B4B4BF",
    foregroundInverse: "#FFFFFF",
    accent: "#5B47E8",
    accentMuted: "#EFEDFE",
    danger: "#B93A32",
    dangerMuted: "#FBEAEA",
  },
  dark: {
    canvas: "#0F0F12",
    surface: "#17171B",
    surfaceMuted: "#1F1F24",
    line: "#2A2A31",
    lineStrong: "#3A3A43",
    foreground: "#F4F4F6",
    foregroundMuted: "#9C9CA8",
    foregroundSubtle: "#6E6E7A",
    foregroundInverse: "#FFFFFF",
    accent: "#8B7BF5",
    accentMuted: "#241F45",
    danger: "#E08A83",
    dangerMuted: "#3A1A18",
  },
} as const satisfies Record<ColorScheme, Record<string, string>>;

export type ThemeColors = (typeof THEME)[ColorScheme];

/*
  Per-content-type accents, lightened for dark so they clear contrast on a dark
  surface. CONTENT_COLORS in content-colors.ts holds the light values and stays
  the call-site-facing constant; this is what useThemeColors resolves against.
*/
export const CONTENT_COLORS_BY_SCHEME = {
  light: {
    note: "#5B47E8",
    recording: "#D6653D",
    resume: "#0F9B7A",
    application: "#2E6FD1",
    profile: "#B23A6B",
    letter: "#A8761C",
  },
  dark: {
    note: "#8B7BF5",
    recording: "#E8896A",
    resume: "#2FC49E",
    application: "#6BA0F0",
    profile: "#E27FA8",
    letter: "#D9A544",
  },
} as const;

/*
  Alpha suffixes for the soft tints on action tiles. A 7% wash reads on white
  but disappears on a dark surface, so dark gets roughly double.
*/
export const TINT_ALPHA = {
  light: { surface: "12", holder: "26" },
  dark: { surface: "26", holder: "3D" },
} as const;
