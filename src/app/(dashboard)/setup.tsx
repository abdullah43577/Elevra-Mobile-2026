import { NotificationsStep } from "@/components/setup/notifications-step";
import { ProfileStep } from "@/components/setup/profile-step";
import { SetupProgress } from "@/components/setup/setup-progress";
import { TourStep } from "@/components/setup/tour-step";
import { TrialStep } from "@/components/setup/trial-step";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useCandidateBackground } from "@/hooks/career-profile/use-candidate-background";
import { useGetCareerProfile } from "@/hooks/career-profile/use-get-career-profile";
import { useResumeImportFlow } from "@/hooks/career-profile/use-resume-import-flow";
import { usePushPermission } from "@/hooks/notifications/use-push-permission";
import { useOfferings } from "@/hooks/subscriptions/use-offerings";
import { useEntitlements } from "@/hooks/use-entitlements";
import { trialLabel } from "@/constants/plans";
import { useSetupStore } from "@/store/setup";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ALL_STEPS = ["profile", "notifications", "trial", "tour"] as const;

export default function Setup() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const { careerProfile, hasCareerProfile } = useGetCareerProfile();
  const { hasBackground } = useCandidateBackground();
  const { isGranted, isRequesting, requestPermission } = usePushPermission();
  const completeSetup = useSetupStore((state) => state.completeSetup);

  const { isPro } = useEntitlements();
  const { packages } = useOfferings();
  const trial = packages.map(trialLabel).find(Boolean) ?? null;
  const STEPS = ALL_STEPS.filter((step) => step !== "trial" || (!isPro && hasBackground));
  const step = STEPS[stepIndex];

  const finish = async function () {
    await completeSetup();
    router.back();
  };

  const goToNextStep = function () {
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  };

  // Setup advances when the profile's updatedAt moves, i.e. when the editor saves.
  const saveBaseline = useRef<string | null>(null);

  const watchForSave = function () {
    saveBaseline.current = careerProfile?.updatedAt ?? "none";
  };

  const importFlow = useResumeImportFlow({
    hasExistingProfile: hasCareerProfile,
    overCurrentTab: true,
    onImported: watchForSave,
  });

  useEffect(() => {
    if (saveBaseline.current === null) return;
    if ((careerProfile?.updatedAt ?? "none") === saveBaseline.current) return;

    saveBaseline.current = null;
    setStepIndex((index) => (index === 0 ? 1 : index));
  }, [careerProfile?.updatedAt]);

  const handleEnterManually = function () {
    watchForSave();
    router.push({
      pathname: "/(dashboard)/profile-editor",
      params: { section: "experience" },
    });
  };

  const handlePrimaryPress = function () {
    if (step === "profile" && !hasBackground) {
      importFlow.handleStart();
      return;
    }

    if (step === "tour") {
      finish();
      return;
    }

    if (step === "trial") {
      goToNextStep();
      router.push("/(dashboard)/paywall");
      return;
    }

    goToNextStep();
  };

  const isLastStep = stepIndex === STEPS.length - 1;
  const isAskingForProfile = step === "profile" && !hasBackground;

  const primaryLabel = isLastStep
    ? "Start using Elevra"
    : isAskingForProfile
      ? "Import your resume PDF"
      : step === "trial"
        ? trial
          ? "Start the free trial"
          : "See Pro plans"
        : "Continue";

  const laterLabel = isAskingForProfile
    ? "I'll do this later"
    : (step === "notifications" && !isGranted) || step === "trial"
      ? "Not now"
      : null;

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="flex-row items-center gap-4 px-5 pt-2">
        <View className="flex-1">
          <SetupProgress total={STEPS.length} activeIndex={stepIndex} />
        </View>

        {!isLastStep && step !== "profile" && (
          <Pressable onPress={finish} hitSlop={8} className="active:opacity-60">
            <AppText type="link">Skip</AppText>
          </Pressable>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 32,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {step === "profile" && <ProfileStep hasBackground={hasBackground} />}

        {step === "notifications" && (
          <NotificationsStep
            isGranted={isGranted}
            isRequesting={isRequesting}
            onEnable={requestPermission}
          />
        )}

        {step === "trial" && <TrialStep trial={trial} />}

        {step === "tour" && <TourStep />}
      </ScrollView>

      <View className="gap-3 px-5 pb-6 pt-2">
        <AppButton
          type="submit"
          label={primaryLabel}
          onPress={handlePrimaryPress}
          isLoading={isAskingForProfile && importFlow.isImporting}
        />

        {isAskingForProfile && (
          <AppButton
            type="secondary"
            label="Enter it myself"
            onPress={handleEnterManually}
            disabled={importFlow.isImporting}
          />
        )}

        {laterLabel && (
          <Pressable
            onPress={goToNextStep}
            hitSlop={8}
            className="items-center py-1 active:opacity-60"
          >
            <AppText type="caption">{laterLabel}</AppText>
          </Pressable>
        )}
      </View>

      <ConfirmDialog
        visible={importFlow.isConfirmingReplace}
        title="Import over your profile?"
        message="What's in the PDF will replace your profile once you review it and tap Save. Until then, nothing changes."
        confirmLabel="Choose PDF"
        onConfirm={importFlow.handleConfirmReplace}
        onCancel={importFlow.handleCancelReplace}
      />
    </SafeAreaView>
  );
}
