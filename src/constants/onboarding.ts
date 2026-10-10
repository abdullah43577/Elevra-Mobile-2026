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
  Told as one application's journey, in order — the product's positioning
  (CLAUDE.md §31). Every slide describes something that ships today, and the
  AI parts say they are Pro: a slide that promises something a new user then
  cannot find loses trust faster than saying less.

  Illustrated with Open Peeps (components/illustrations): two-colour line art
  themed from tokens, so one file works in both schemes at about 11KB a figure.
*/
export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "journey",
    title: "From the posting to the thank-you",
    subtitle:
      "Paste a job link and Elevra sets up the application, then walks you through every step to the offer.",
    illustration: "onboardingTracker",
    accent: "application",
  },
  {
    id: "resume",
    title: "A resume shaped to each job",
    subtitle:
      "Six ATS-safe templates, filled from your profile or an old PDF. Pro rewrites a copy around each posting, using only what is true about you.",
    illustration: "onboardingResume",
    accent: "resume",
  },
  {
    id: "letters",
    title: "Letters and emails, drafted",
    subtitle:
      "Cover letters that match the resume they go with, plus follow-ups and thank-yous ready to send. Drafting comes with Pro.",
    illustration: "onboardingLetters",
    accent: "letter",
  },
  {
    id: "interview",
    title: "Rehearse out loud",
    subtitle:
      "Practise the questions you would rather avoid. Pro writes them from the posting and tells you how each answer lands.",
    illustration: "onboardingInterview",
    accent: "interview",
  },
  {
    id: "capture",
    title: "Everything about a job, together",
    subtitle:
      "Notes and voice memos attach to the application they are about, and one search finds any of it.",
    illustration: "onboardingCapture",
    accent: "note",
  },
];
