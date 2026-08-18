import { BenefitRow } from "@/components/paywall/benefit-row";
import { PlanOption } from "@/components/paywall/plan-option";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { ScreenHeader } from "@/components/shared/screen-header";
import { PRO_BENEFITS, toPlanPresentations } from "@/constants/plans";
import { useGetSubscription } from "@/hooks/subscriptions/use-get-subscription";
import { useOfferings } from "@/hooks/subscriptions/use-offerings";
import { usePurchasePro } from "@/hooks/subscriptions/use-purchase-pro";
import { useEntitlements } from "@/hooks/use-entitlements";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatRenewalDate = function (iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function Paywall() {
  const router = useRouter();
  const { accent } = useThemeColors();
  const { isPro } = useEntitlements();

  const { packages, isFetchingOfferings, errorOfferings } = useOfferings();

  // Only on the Pro screen: a free user has no subscription to describe, and
  // this endpoint re-pulls from RevenueCat when its copy is stale.
  const { subscription } = useGetSubscription({ shouldFetch: isPro });
  const { purchase, restore, isPurchasing, isRestoring } = usePurchasePro({
    onEntitled: () => router.back(),
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const plans = toPlanPresentations(packages);

  // The first plan is annual (toPlanPresentations orders it that way), and a
  // paywall with nothing selected costs the user a tap for no reason.
  useEffect(() => {
    if (!selectedId && plans.length) setSelectedId(plans[0]!.id);
  }, [plans, selectedId]);

  const selectedPlan = plans.find((plan) => plan.id === selectedId);

  const handlePurchase = function () {
    const pack = packages.find((item) => item.identifier === selectedId);
    if (pack) purchase(pack);
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

          {subscription?.expiresAt && (
            <AppText type="caption" className="mt-5 text-center">
              Next billed on {formatRenewalDate(subscription.expiresAt)}
            </AppText>
          )}

          <AppText type="caption" className="mt-3 text-center">
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
          {isFetchingOfferings ? (
            <View className="items-center py-8">
              <ActivityIndicator color={accent} />
            </View>
          ) : errorOfferings ? (
            /*
              The failure is stated rather than hidden behind a dead Continue
              button. Most often this is a build without the native module —
              the SDK is only present in a dev client compiled since it was
              added.
            */
            <View className="rounded-2xl border-hairline border-line bg-surface px-4 py-5">
              <AppText type="label" className="text-center">
                {errorOfferings}
              </AppText>
              <AppText type="caption" className="mt-1.5 text-center">
                Nothing has been charged. Try again from a newer build.
              </AppText>
            </View>
          ) : (
            plans.map((plan) => (
              <PlanOption
                key={plan.id}
                plan={plan}
                isSelected={selectedId === plan.id}
                accent={accent}
                onSelect={() => setSelectedId(plan.id)}
              />
            ))
          )}
        </View>

        <AppButton
          type="submit"
          label={
            selectedPlan?.trial
              ? `Start your ${selectedPlan.trial.replace(" free", "")} free trial`
              : "Continue"
          }
          onPress={handlePurchase}
          isLoading={isPurchasing}
          disabled={!selectedId || isRestoring}
          className="mt-6"
          style={{ backgroundColor: accent }}
        />

        <Pressable
          onPress={restore}
          hitSlop={8}
          disabled={isRestoring || isPurchasing}
          className="mt-4 active:opacity-70"
        >
          <AppText type="link" className="text-center">
            {isRestoring ? "Restoring..." : "Restore purchases"}
          </AppText>
        </Pressable>

        {/*
          Both stores require the offer to be stated in full before purchase —
          trial length, what it becomes, the price and that it auto-renews. This
          is a common rejection, and it is also simply the honest thing to put
          next to a button that starts a recurring charge.
        */}
        <AppText type="caption" className="mt-5 text-center">
          {selectedPlan?.trial
            ? `Your ${selectedPlan.trial.replace(" free", "")} free trial converts to ${selectedPlan.price} ${selectedPlan.period} unless cancelled before it ends. `
            : ""}
          Prices are shown in your local currency and confirmed by the App Store
          or Google Play before any charge. Subscriptions renew automatically
          until cancelled, and can be managed from your store account.
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}
