import { BenefitRow } from "@/components/paywall/benefit-row";
import { PlanOption } from "@/components/paywall/plan-option";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { ScreenHeader } from "@/components/shared/screen-header";
import { DEFAULT_PLAN, PLANS, PlanId, PRO_BENEFITS } from "@/constants/plans";
import { useEntitlements } from "@/hooks/use-entitlements";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { showToast } from "@/utils/show-toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Paywall() {
  const router = useRouter();
  const { accent } = useThemeColors();
  const { isPro } = useEntitlements();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>(DEFAULT_PLAN);

  /*
    Phase 3 replaces this with a RevenueCat purchase call. It deliberately says
    so out loud rather than failing silently — a button that looks live and does
    nothing is worse than one that admits it is not wired yet.
  */
  const handlePurchase = function () {
    showToast("warning", "Checkout is not connected yet");
  };

  const handleRestore = function () {
    showToast("warning", "Restore is not connected yet");
  };

  if (isPro) {
    return (
      <SafeAreaView className="flex-1 bg-canvas">
        <ScreenHeader title="Elevra Pro" onBack={() => router.back()} backIcon="close" />

        <View className="flex-1 items-center justify-center px-8">
          <View
            className="mb-5 items-center justify-center rounded-full"
            style={{ width: 64, height: 64, backgroundColor: `${accent}1F` }}
          >
            <Ionicons name="checkmark-circle" size={30} color={accent} />
          </View>

          <AppText type="title" className="text-center">
            You are on Pro
          </AppText>
          <AppText type="subtitle" className="mt-2 text-center">
            Every AI feature and unlimited PDF exports are unlocked on this
            account.
          </AppText>

          <AppText type="caption" className="mt-6 text-center">
            Manage or cancel your subscription from your App Store or Google
            Play account settings.
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader title="Elevra Pro" onBack={() => router.back()} backIcon="close" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pb-2 pt-2">
          <View
            className="mb-4 items-center justify-center rounded-full"
            style={{ width: 60, height: 60, backgroundColor: `${accent}1F` }}
          >
            <Ionicons name="sparkles" size={26} color={accent} />
          </View>

          <AppText type="display" className="text-center text-[26px] leading-[32px]">
            Get the whole toolkit
          </AppText>
          <AppText type="subtitle" className="mt-2 text-center">
            Keep building for free. Upgrade when you need the finished file or
            the AI behind it.
          </AppText>
        </View>

        <View className="mt-7 gap-4">
          {PRO_BENEFITS.map((benefit) => (
            <BenefitRow key={benefit.title} {...benefit} accent={accent} />
          ))}
        </View>

        <View className="mt-8 gap-3">
          {PLANS.map((plan) => (
            <PlanOption
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              accent={accent}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </View>

        <AppButton
          type="submit"
          label="Continue"
          onPress={handlePurchase}
          className="mt-6"
          style={{ backgroundColor: accent }}
        />

        <Pressable onPress={handleRestore} hitSlop={8} className="mt-4 active:opacity-70">
          <AppText type="link" className="text-center">
            Restore purchases
          </AppText>
        </Pressable>

        <AppText type="caption" className="mt-5 text-center">
          Prices shown are indicative and will be confirmed by the App Store or
          Google Play before any charge. Subscriptions renew automatically until
          cancelled.
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}
