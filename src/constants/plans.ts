import { Ionicons } from "@expo/vector-icons";
import type { PurchasesPackage } from "react-native-purchases";

/*
  Presentation only. Prices, periods and product ids all come from RevenueCat at
  runtime — both stores require the localised price for the user's region, and a
  hardcoded "$6.99" is wrong in most countries and a review rejection.

  What stays hardcoded is the copy that is *ours*: which package reads as the
  headline, and what the caption says.
*/
export interface PlanPresentation {
  id: string;
  label: string;
  price: string;
  period: string;
  caption?: string;
  badge?: string;
  /** e.g. "7 days free" — absent when the product has no introductory offer. */
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

// Annual first — it is the one worth defaulting to, and a list that opens on the
// most expensive per-month option reads as a worse offer than it is.
const ORDER = ["ANNUAL", "SIX_MONTH", "THREE_MONTH", "MONTHLY", "WEEKLY", "LIFETIME"];

const pluralise = function (value: number, unit: string) {
  const name = unit.toLowerCase();
  return `${value} ${name}${value === 1 ? "" : "s"}`;
};

/*
  A free trial reaches us in two different shapes and both have to be read, or
  the offer silently disappears on one platform:

  - Google Play Billing 5+ models it as a free pricing *phase* on the default
    subscription option;
  - StoreKit — and the Test Store — model it as an introductory price of zero.

  Reading it from the product rather than hardcoding "7 days" means changing the
  trial in the RevenueCat dashboard does not need an app update, which is the
  same reason prices are not written down here.
*/
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

/*
  The saving is computed against the monthly package rather than written down.
  A hardcoded "Save 40%" becomes a lie the first time either price moves, and
  price changes are exactly the thing RevenueCat exists to let you make without
  shipping an app update.
*/
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
