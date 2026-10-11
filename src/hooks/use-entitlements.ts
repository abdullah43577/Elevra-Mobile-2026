import { ProFeature } from "@/constants/entitlements";
import { useGetProfile } from "@/hooks/use-get-profile";
import { SubscriptionTier } from "../../types/auth";

// Shapes the UI only; the server enforces the same rules and answers 402.
export const useEntitlements = function () {
  const { profile } = useGetProfile();

  const tier: SubscriptionTier = profile?.settings?.subscriptionTier ?? "FREE";
  const isPro = tier === "PRO";

  // `feature` is unused while every gate needs the same tier.
  const can = function (_feature: ProFeature) {
    return isPro;
  };

  return { tier, isPro, can };
};
