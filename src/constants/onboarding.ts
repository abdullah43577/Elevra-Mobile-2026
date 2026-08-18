import { Ionicons } from "@expo/vector-icons";
import { ContentType } from "./content-colors";

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Drives the slide's accent, so each one reads as the feature it describes. */
  accent: ContentType;
}

/*
  Every slide describes something that ships today.

  The previous deck sold AI resume guidance, AI note structuring and an AI
  rewriter — all three still `ComingSoon` — plus export and "sync in a single
  tap", when export is Pro-gated and sync does not exist. Four of five slides
  promised something a new user would immediately fail to find, which is a
  faster way to lose trust than saying less.

  No illustrations, deliberately. The old PNGs were inconsistent (one was dark
  glassmorphic stock art of the rewriter, a feature that does not exist), every
  one had a baked light background that renders as a bright slab in dark mode,
  and together they were ~4.5MB. An icon tile in the feature's own accent is the
  language the rest of the app already uses.
*/
export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "resume",
    title: "Resumes that get read",
    subtitle:
      "Six ATS-safe templates and a guided builder. Real selectable text on export, never a screenshot in a PDF.",
    icon: "document-outline",
    accent: "resume",
  },
  {
    id: "tracker",
    title: "Every application in one place",
    subtitle:
      "Follow each role from saved to offer, with the exact resume and cover letter you sent kept alongside it.",
    icon: "briefcase-outline",
    accent: "application",
  },
  {
    id: "letters",
    title: "Cover letters that match",
    subtitle:
      "Write one per role and it takes the styling of the resume it is sent with, so the pair arrives looking like a set.",
    icon: "mail-outline",
    accent: "letter",
  },
  {
    id: "interview",
    title: "Rehearse out loud",
    subtitle:
      "A question bank with a practice runner that puts the answers you keep avoiding in front of you first.",
    icon: "chatbubbles-outline",
    accent: "interview",
  },
  {
    id: "capture",
    title: "Notes, memos, and one search",
    subtitle:
      "Keep everything from a recruiter call to a post-interview voice memo, and find any of it from one place.",
    icon: "search-outline",
    accent: "note",
  },
];
