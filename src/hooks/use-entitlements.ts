import { ProFeature } from "@/constants/entitlements";
import { useGetProfile } from "@/hooks/use-get-profile";
import { SubscriptionTier } from "../../types/auth";

/*
  Shapes the UI only. The server enforces the same rules and answers 402 on any
  gated call, so this being wrong (or tampered with) costs nothing but a worse
  first impression.
*/
export const useEntitlements = function () {
  const { profile } = useGetProfile();

  const tier: SubscriptionTier = profile?.settings?.subscriptionTier ?? "FREE";
  const isPro = tier === "PRO";

  // Currently every gated feature needs the same tier, so the argument is
  // unused. It stays in the signature so call sites already read correctly if a
  // second paid tier ever lands.
  const can = function (_feature: ProFeature) {
    return isPro;
  };

  return { tier, isPro, can };
};
