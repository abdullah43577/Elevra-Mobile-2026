export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  image: any;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Build professional resumes",
    subtitle:
      "Create ATS-friendly resumes with AI guidance, tailored to your career goals.",
    image: require("@/assets/images/onboarding/onboarding-resume.png"),
  },
  {
    id: "2",
    title: "Convert voice into smart notes",
    subtitle:
      "Record lectures, meetings, or ideas and let AI turn them into structured notes.",
    image: require("@/assets/images/onboarding/onboarding-voice.png"),
  },
  {
    id: "3",
    title: "Improve your writing with AI",
    subtitle:
      "Rewrite and polish your text instantly for tone, clarity, and professionalism.",
    image: require("@/assets/images/onboarding/onboarding-rewrite.png"),
  },
  {
    id: "4",
    title: "Organize your productivity",
    subtitle:
      "Keep your notes, resumes, and career tools in one connected workspace.",
    image: require("@/assets/images/onboarding/onboarding-organize.png"),
  },
  {
    id: "5",
    title: "Export and share instantly",
    subtitle: "Download, share, or sync your work anywhere in a single tap.",
    image: require("@/assets/images/onboarding/onboarding-export.png"),
  },
];
