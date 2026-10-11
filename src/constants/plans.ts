import { Ionicons } from "@expo/vector-icons";
import type { PurchasesPackage } from "react-native-purchases";

export interface PlanPresentation {
  id: string;
  label: string;
  price: string;
  period: string;
  caption?: string;
  badge?: string;
  trial?: string;
}

const PACKAGE_META: Record<string, { label: string; period: string; caption?: string }> = {
  ANNUAL: { label: "Annual", period: "per year" },
  MONTHLY: { label: "Monthly", period: "per month", caption: "Cancel any time" },
  THREE_MONTH: { label: "Quarterly", period: "every 3 months" },
  SIX_MONTH: { label: "Half-yearly", period: "every 6 months" },
  WEEKLY: { label: "Weekly", period: "per week" },
  LIFETIME: { label: "Lifetime", period: "one payment" },
};

const ORDER = ["ANNUAL", "SIX_MONTH", "THREE_MONTH", "MONTHLY", "WEEKLY", "LIFETIME"];

const pluralise = function (value: number, unit: string) {
  const name = unit.toLowerCase();
  return `${value} ${name}${value === 1 ? "" : "s"}`;
};

// Play Billing 5+ models a trial as a free pricing phase; StoreKit and the Test
// Store as a zero intro price. Both must be read or the trial vanishes on one.
export const trialLabel = function (pack: PurchasesPackage): string | null {
  const freePhase = pack.product.defaultOption?.freePhase;

  if (freePhase?.billingPeriod) {
    return `${pluralise(freePhase.billingPeriod.value, freePhase.billingPeriod.unit)} free`;
  }

  const intro = pack.product.introPrice;

  if (intro && intro.price === 0) {
    return `${pluralise(intro.periodNumberOfUnits, intro.periodUnit)} free`;
  }

  return null;
};

const monthlyEquivalent = function (pack: PurchasesPackage) {
  const price = pack.product.price;

  switch (pack.packageType) {
    case "ANNUAL":
      return price / 12;
    case "SIX_MONTH":
      return price / 6;
    case "THREE_MONTH":
      return price / 3;
    case "MONTHLY":
      return price;
    default:
      return null;
  }
};

export const toPlanPresentations = function (
  packages: PurchasesPackage[],
): PlanPresentation[] {
  const monthly = packages.find((pack) => pack.packageType === "MONTHLY");
  const monthlyPrice = monthly?.product.price ?? null;

  const sorted = [...packages].sort(
    (a, b) => ORDER.indexOf(a.packageType) - ORDER.indexOf(b.packageType),
  );

  return sorted.map((pack) => {
    const meta = PACKAGE_META[pack.packageType] ?? {
      label: pack.product.title,
      period: "",
    };

    const equivalent = monthlyEquivalent(pack);

    const savings =
      monthlyPrice && equivalent && pack.packageType !== "MONTHLY"
        ? Math.round((1 - equivalent / monthlyPrice) * 100)
        : 0;

    const caption =
      equivalent && pack.packageType !== "MONTHLY"
        ? `Works out at ${pack.product.currencyCode} ${equivalent.toFixed(2)} a month`
        : meta.caption;

    const trial = trialLabel(pack);

    return {
      id: pack.identifier,
      label: meta.label,
      price: pack.product.priceString,
      period: meta.period,
      ...(caption && { caption }),
      ...(savings >= 5 && { badge: `Save ${savings}%` }),
      ...(trial && { trial }),
    };
  });
};

interface Benefit {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

// Keep in step with PRO_FEATURES, or the paywall sells an incomplete list.
export const PRO_BENEFITS: Benefit[] = [
  {
    icon: "sparkles-outline",
    title: "A resume tailored to every job",
    description:
      "A copy rewritten around each posting from what's already true about you, with the keywords it still misses.",
  },
  {
    icon: "mail-outline",
    title: "Letters and emails written for you",
    description:
      "Cover letter drafts, follow-ups, thank-yous and offer replies, from your own notes.",
  },
  {
    icon: "chatbubbles-outline",
    title: "Interview coaching",
    description:
      "Questions written from the posting, and feedback on your recorded answers — pace, filler words, structure.",
  },
  {
    icon: "mic-outline",
    title: "Transcripts and summaries",
    description: "Voice notes turned into searchable text, and long notes into a summary.",
  },
  {
    icon: "infinite-outline",
    title: "Everything else stays free",
    description:
      "Unlimited applications, resumes, letters and notes, every template, and PDF export — Pro or not.",
  },
];
