import type { PeepName } from "@/components/illustrations/peeps.generated";
import { ContentType } from "./content-colors";

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  illustration: PeepName;
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

  Illustrated with Open Peeps (components/illustrations). The first onboarding
  art was dropped for being inconsistent, baked onto a light background that
  became a bright slab in dark mode, and ~4.5MB in total. Two-colour line art
  themed from tokens fixes all three, at about 11KB a figure.
*/
export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "resume",
    title: "Resumes that get read",
    subtitle:
      "Six ATS-safe templates and a guided builder. Real selectable text on export, never a screenshot in a PDF.",
    illustration: "onboardingResume",
    accent: "resume",
  },
  {
    id: "tracker",
    title: "Every application in one place",
    subtitle:
      "Follow each role from saved to offer, with the exact resume and cover letter you sent kept alongside it.",
    illustration: "onboardingTracker",
    accent: "application",
  },
  {
    id: "letters",
    title: "Cover letters that match",
    subtitle:
      "Write one per role and it takes the styling of the resume it is sent with, so the pair arrives looking like a set.",
    illustration: "onboardingLetters",
    accent: "letter",
  },
  {
    id: "interview",
    title: "Rehearse out loud",
    subtitle:
      "A question bank with a practice runner that puts the answers you keep avoiding in front of you first.",
    illustration: "onboardingInterview",
    accent: "interview",
  },
  {
    id: "capture",
    title: "Notes, memos, and one search",
    subtitle:
      "Keep everything from a recruiter call to a post-interview voice memo, and find any of it from one place.",
    illustration: "onboardingCapture",
    accent: "note",
  },
];
