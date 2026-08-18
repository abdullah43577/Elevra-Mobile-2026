import { AppText } from "@/components/shared/app-text";
import { PRO_FEATURE_COPY, ProFeature } from "@/constants/entitlements";
import { useEntitlements } from "@/hooks/use-entitlements";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";

interface Props {
  feature: ProFeature;
  children: ReactNode;
  /** Defaults to opening the paywall; override only for a different destination. */
  onUpgrade?: () => void;
}

/*
  Renders children for Pro users, and an upgrade prompt for everyone else.

  Sibling of ComingSoon: that one hides what does not exist yet, this one hides
  what exists but is paid. Neither is a security boundary — the server re-checks
  every gated call and answers 402.

*/
export const ProGate = function ({ feature, children, onUpgrade }: Props) {
  const { isPro } = useEntitlements();
  const { accent } = useThemeColors();

  if (isPro) return <>{children}</>;

  const copy = PRO_FEATURE_COPY[feature];

  return (
    <View
      className="items-center rounded-2xl border-hairline border-line bg-surface px-6 py-8"
      style={{ borderColor: `${accent}40` }}
    >
      <View
        className="mb-4 items-center justify-center rounded-full"
        style={{ width: 52, height: 52, backgroundColor: `${accent}1F` }}
      >
        <Ionicons name="sparkles" size={22} color={accent} />
      </View>

      <AppText type="title" className="text-center text-[18px] leading-[24px]">
        {copy.title}
      </AppText>

      <AppText type="subtitle" className="mt-1.5 text-center">
        {copy.blurb}
      </AppText>

      <Pressable
        onPress={onUpgrade ?? (() => router.push("/(dashboard)/paywall"))}
        className="mt-5 rounded-2xl px-6 py-3 active:opacity-80"
        style={{ backgroundColor: accent }}
      >
        <AppText type="label" className="text-foreground-inverse">
          See Pro plans
        </AppText>
      </Pressable>
    </View>
  );
};

/*
  For gating an action rather than a region — an Export button that should stay
  visible but explain itself when tapped. Returns whether the action may run.
*/
export const useProAction = function (feature: ProFeature) {
  const { can } = useEntitlements();
  const copy = PRO_FEATURE_COPY[feature];

  return { allowed: can(feature), copy };
};
