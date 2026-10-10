import { NotificationsStep } from "@/components/setup/notifications-step";
import { QuickProfileStep } from "@/components/setup/quick-profile-step";
import { SetupProgress } from "@/components/setup/setup-progress";
import { TourStep } from "@/components/setup/tour-step";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useGetCareerProfile } from "@/hooks/career-profile/use-get-career-profile";
import { useResumeImportFlow } from "@/hooks/career-profile/use-resume-import-flow";
import { useSaveCareerProfile } from "@/hooks/career-profile/use-save-career-profile";
import { usePushPermission } from "@/hooks/notifications/use-push-permission";
import { useGetProfile } from "@/hooks/use-get-profile";
import {
  QuickProfileFormValues,
  quickProfileSchema,
} from "@/schemas/setup/quick-profile";
import { useSetupStore } from "@/store/setup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const STEPS = ["profile", "notifications", "tour"] as const;

export default function Setup() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const { profile } = useGetProfile();
  const { careerProfile, hasCareerProfile, hasLoadedCareerProfile } = useGetCareerProfile();
  const { saveCareerProfile, isSavingCareerProfile } = useSaveCareerProfile({
    silent: true,
  });
  const { isGranted, isRequesting, requestPermission } = usePushPermission();
  const completeSetup = useSetupStore((state) => state.completeSetup);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickProfileFormValues>({
    resolver: zodResolver(quickProfileSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  /*
    Seeded once, behind a ref. The account already holds a name and an email —
    asking for them again at the first screen of the app is busywork — but the
    two queries resolve after first paint, and re-seeding on every refetch would
    wipe whatever the user had started typing. Same guard as the resume builder.
  */
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current || !profile || !hasLoadedCareerProfile) return;

    hasHydrated.current = true;

    const personalInfo = careerProfile?.personalInfo;

    reset({
      firstName: personalInfo?.firstName || profile.first_name || "",
      lastName: personalInfo?.lastName || profile.last_name || "",
      email: personalInfo?.email || profile.email || "",
      title: personalInfo?.title || "",
      location: personalInfo?.location || "",
      ...(personalInfo?.phone && { phone: personalInfo.phone }),
    });
  }, [profile, careerProfile, hasLoadedCareerProfile, reset]);

  const finish = async function () {
    await completeSetup();
    router.back();
  };

  const goToNextStep = function () {
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  };

  /*
    An import opens the full editor over setup. When the user saves there, the
    profile's updatedAt moves and setup steps past the profile step — showing
    the quick form again would invite a second, smaller save over the import.
    Backing out of the editor unsaved leaves updatedAt alone, so they land back
    on this step.
  */
  const importBaseline = useRef<string | null>(null);

  const importFlow = useResumeImportFlow({
    hasExistingProfile: hasCareerProfile,
    onImported: () => {
      importBaseline.current = careerProfile?.updatedAt ?? "none";
    },
  });

  useEffect(() => {
    if (importBaseline.current === null) return;
    if ((careerProfile?.updatedAt ?? "none") === importBaseline.current) return;

    importBaseline.current = null;
    setStepIndex((index) => (STEPS[index] === "profile" ? index + 1 : index));
  }, [careerProfile?.updatedAt]);

  const handleSaveProfile = async function (values: QuickProfileFormValues) {
    try {
      await saveCareerProfile({
        // Merged, not replaced: personalInfo is stored as one value, and a quick
        // save of five fields used to erase the summary and anything else in it.
        personalInfo: {
          ...careerProfile?.personalInfo,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          ...(values.title?.trim() && { title: values.title.trim() }),
          ...(values.location?.trim() && { location: values.location.trim() }),
          ...(values.phone?.trim() && { phone: values.phone.trim() }),
        },
      });
    } catch {
      // The save is a convenience, not a gate. useSubmitData has already
      // surfaced the failure, and blocking setup on it would strand the user on
      // a screen whose only other exit is Skip.
    }

    goToNextStep();
  };

  const handlePrimaryPress = function () {
    if (STEPS[stepIndex] === "profile") {
      handleSubmit(handleSaveProfile)();
      return;
    }

    if (STEPS[stepIndex] === "tour") {
      finish();
      return;
    }

    goToNextStep();
  };

  const isLastStep = stepIndex === STEPS.length - 1;

  const primaryLabel = isLastStep
    ? "Start using Elevra"
    : STEPS[stepIndex] === "profile"
      ? "Save and continue"
      : "Continue";

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="flex-row items-center gap-4 px-5 pt-2">
        <View className="flex-1">
          <SetupProgress total={STEPS.length} activeIndex={stepIndex} />
        </View>

        {!isLastStep && (
          <Pressable onPress={finish} hitSlop={8} className="active:opacity-60">
            <AppText type="link">Skip</AppText>
          </Pressable>
        )}
      </View>

      {/*
        KeyboardAwareScrollView rather than KeyboardAvoidingView: this screen
        was the only form in the app still on the latter, and its Android
        behavior was undefined, so nothing moved and the keyboard sat over the
        lower inputs. Same props as every other form screen here.
      */}
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 32,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20}
      >
        {STEPS[stepIndex] === "profile" && (
          <QuickProfileStep
            control={control}
            errors={errors}
            isImporting={importFlow.isImporting}
            onImport={importFlow.handleStart}
          />
        )}

        {STEPS[stepIndex] === "notifications" && (
          <NotificationsStep
            isGranted={isGranted}
            isRequesting={isRequesting}
            onEnable={requestPermission}
          />
        )}

        {STEPS[stepIndex] === "tour" && <TourStep />}
      </KeyboardAwareScrollView>

      <View className="gap-3 px-5 pb-6 pt-2">
        <AppButton
          type="submit"
          label={primaryLabel}
          onPress={handlePrimaryPress}
          isLoading={isSavingCareerProfile}
        />

        {STEPS[stepIndex] === "notifications" && !isGranted && (
          <Pressable
            onPress={goToNextStep}
            hitSlop={8}
            className="items-center py-1 active:opacity-60"
          >
            <AppText type="caption">Not now</AppText>
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
