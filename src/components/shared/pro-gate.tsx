import { PRO_FEATURE_COPY, ProFeature } from "@/constants/entitlements";
import { useEntitlements } from "@/hooks/use-entitlements";

/*
  Gates an action that stays visible but explains itself when tapped. Not a
  security boundary — the server re-checks every gated call and answers 402.
*/
export const useProAction = function (feature: ProFeature) {
  const { can } = useEntitlements();
  const copy = PRO_FEATURE_COPY[feature];

  return { allowed: can(feature), copy };
};
