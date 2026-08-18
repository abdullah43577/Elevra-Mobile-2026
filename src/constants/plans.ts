import { Ionicons } from "@expo/vector-icons";

export type PlanId = "monthly" | "annual";

export interface Plan {
  id: PlanId;
  label: string;
  /**
   * Placeholder only. In production these MUST come from the store at runtime —
   * App Store and Play require the localised price for the user's region, and a
   * hardcoded "$6.99" is both wrong in most countries and a review rejection.
   * Phase 3 replaces `price`/`period` with values read from RevenueCat.
   */
  price: string;
  period: string;
  caption?: string;
  badge?: string;
  /** Filled in Phase 3 once the products exist in App Store Connect / Play. */
  productId?: string;
}

export const PLANS: Plan[] = [
  {
    id: "annual",
    label: "Annual",
    price: "$49.99",
    period: "per year",
    caption: "Works out at $4.17 a month",
    badge: "Save 40%",
  },
  {
    id: "monthly",
    label: "Monthly",
    price: "$6.99",
    period: "per month",
    caption: "Cancel any time",
  },
];

export const DEFAULT_PLAN: PlanId = "annual";

interface Benefit {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

/*
  Written as outcomes rather than feature names. "Export as PDF" is a checkbox;
  "send a real file to employers" is the reason someone pays.

  Mirrors what src/constants/entitlements.ts actually gates — if you add a
  PRO_FEATURE, it belongs here too or the paywall is selling an incomplete list.
*/
export const PRO_BENEFITS: Benefit[] = [
  {
    icon: "download-outline",
    title: "Export resumes as PDF",
    description:
      "Download an ATS-ready file from any template and send it straight to employers.",
  },
  {
    icon: "sparkles-outline",
    title: "Every AI feature",
    description:
      "Note summaries, the AI rewriter, AI chat, and career tools as they land.",
  },
  {
    icon: "mic-outline",
    title: "Voice transcription",
    description: "Turn any recording into searchable text you can edit and reuse.",
  },
  {
    icon: "infinite-outline",
    title: "Everything else stays free",
    description:
      "Unlimited notes, recordings, applications, resumes, and all templates — Pro or not.",
  },
];
