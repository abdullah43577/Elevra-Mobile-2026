import type { PeepName } from "@/components/illustrations/peeps.generated";
import { ContentType } from "./content-colors";

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  illustration: PeepName;
  accent: ContentType;
}

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
