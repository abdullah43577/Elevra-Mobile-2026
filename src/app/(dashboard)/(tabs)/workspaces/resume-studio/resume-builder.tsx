import { PrefillCard } from "@/components/resume-studio/builder/prefill-card";
import { BuilderFooter } from "@/components/resume-studio/builder/builder-footer";
import { BuilderPreview } from "@/components/resume-studio/builder/builder-preview";
import { BUILDER_STEPS } from "@/components/resume-studio/builder/builder-steps";
import { BuilderStepContent } from "@/components/resume-studio/builder/builder-step-content";
import { StepNav } from "@/components/resume-studio/builder/step-nav";
import { AppText } from "@/components/shared/app-text";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { IconButton } from "@/components/shared/icon-button";
import { ScreenHeader } from "@/components/shared/screen-header";
import { useGetCareerProfile } from "@/hooks/career-profile/use-get-career-profile";
import { useSaveCareerProfile } from "@/hooks/career-profile/use-save-career-profile";
import { useGetResumeById } from "@/hooks/resume/use-get-resume-by-id";
import { useGetTemplateById } from "@/hooks/resume/use-get-template-by-id";
import { useSaveResume } from "@/hooks/resume/use-save-resume";
import { useThemeColors } from "@/hooks/use-theme-colors";
import {
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  ResumeBuilderFormValues,
  resumeBuilderSchema,
} from "@/schemas/resume-builder/resume-builder";
import { toResumeFormValues } from "@/utils/career-profile";
import { showToast } from "@/utils/show-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResumeBuilder() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("resume");

  const params = useLocalSearchParams<{
    templateId?: string;
    resumeId?: string;
    applicationId?: string;
  }>();
  const { templateId, resumeId, applicationId } = params;
  const isEditing = !!resumeId;

  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isPrefillConfirmVisible, setIsPrefillConfirmVisible] = useState(false);
  const [pendingResume, setPendingResume] =
    useState<ResumeBuilderFormValues | null>(null);

  const { template: fetchedTemplate, isFetchingTemplate } = useGetTemplateById({
    templateId: templateId || "",
  });
  const { resume, isFetchingResume } = useGetResumeById({
    resumeId: resumeId || "",
  });

  const template = fetchedTemplate ?? resume?.template;
  const { saveResume, isSaving } = useSaveResume({ resumeId, shouldRedirect: !applicationId });

  const { careerProfile, hasCareerProfile } = useGetCareerProfile();
  const { saveCareerProfile, isSavingCareerProfile } = useSaveCareerProfile({
    silent: true,
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors, isDirty },
  } = useForm<ResumeBuilderFormValues>({
    resolver: zodResolver(resumeBuilderSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: "",
      },
      experience: [DEFAULT_EXPERIENCE],
      education: [DEFAULT_EDUCATION],
      // Skills is chip-based: a seeded entry renders as an empty chip and fails
      // skillSchema's min(1) on save.
      skills: [],
      // A seeded blank row fails its item schema and blocks saving.
      languages: [],
      certifications: [],
      projects: [],
      references: [],
    },
  });

  // Must precede the hydrate effect: on native, useFieldArray subscribes to
  // reset() in a plain effect, so a reset fired first never reaches `fields`.
  const experience = useFieldArray({ control, name: "experience" });
  const education = useFieldArray({ control, name: "education" });
  const skills = useFieldArray({ control, name: "skills" });
  const languages = useFieldArray({ control, name: "languages" });
  const certifications = useFieldArray({ control, name: "certifications" });
  const projects = useFieldArray({ control, name: "projects" });
  const references = useFieldArray({ control, name: "references" });

  // Guarded by id: the query object changes identity on every background
  // refetch, and re-hydrating would wipe the user's edits.
  const hydratedId = useRef<string | null>(null);

  useEffect(() => {
    if (!resume || !isEditing || hydratedId.current === resume.id) return;
    hydratedId.current = resume.id;

    reset({
      personalInfo: {
        firstName: resume.personalInfo?.firstName || "",
        lastName: resume.personalInfo?.lastName || "",
        email: resume.personalInfo?.email || "",
        phone: resume.personalInfo?.phone || "",
        location: resume.personalInfo?.location || "",
        title: resume.personalInfo?.title || "",
        summary: resume.personalInfo?.summary || "",
      },
      experience: resume.experience?.length
        ? resume.experience
        : [DEFAULT_EXPERIENCE],
      education: resume.education?.length
        ? resume.education
        : [DEFAULT_EDUCATION],
      skills: resume.skills ?? [],
      languages: resume.languages ?? [],
      certifications: resume.certifications ?? [],
      projects: resume.projects ?? [],
      references: resume.references ?? [],
    });

    setFurthestStep(BUILDER_STEPS.length - 1);
  }, [resume, isEditing]);

  const goToStep = function (index: number) {
    setActiveStep(index);
    setFurthestStep((previous) => Math.max(previous, index));
  };

  const handleNext = async function () {
    const step = BUILDER_STEPS[activeStep];
    const isValid = await trigger(step.id);

    if (!isValid) {
      showToast("error", `Check the ${step.label.toLowerCase()} section`);
      return;
    }

    goToStep(Math.min(activeStep + 1, BUILDER_STEPS.length - 1));
  };

  const handleSkip = function () {
    goToStep(Math.min(activeStep + 1, BUILDER_STEPS.length - 1));
  };

  const handlePrefill = function () {
    if (!careerProfile) return;

    reset(toResumeFormValues(careerProfile));
    setFurthestStep(BUILDER_STEPS.length - 1);
    setIsPrefillConfirmVisible(false);
    showToast("success", "Prefilled from your career profile");
  };

  const handlePrefillPress = function () {
    if (isDirty) {
      setIsPrefillConfirmVisible(true);
      return;
    }

    handlePrefill();
  };

  const handleSetUpProfile = function () {
    router.push("/(dashboard)/(tabs)/workspaces/career-profile");
  };

  const persistResume = async function (data: ResumeBuilderFormValues) {
    const resolvedTemplateId = templateId ?? resume?.templateId;

    if (!resolvedTemplateId) {
      showToast("error", "Template not found");
      return;
    }

    const name = [data.personalInfo?.firstName, data.personalInfo?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    await saveResume({
      title: name ? `${name} Resume` : "My Resume",
      templateId: resolvedTemplateId,
      personalInfo: data.personalInfo,
      experience: data.experience,
      education: data.education,
      skills: data.skills,
      languages: data.languages,
      certifications: data.certifications,
      projects: data.projects,
      references: data.references,
    });

    if (applicationId) router.back();
  };

  // Offered before saving, because a successful create redirects off this screen.
  const handleSave = async function (data: ResumeBuilderFormValues) {
    if (!isEditing && !hasCareerProfile) {
      setPendingResume(data);
      return;
    }

    await persistResume(data);
  };

  const handleSaveBoth = async function () {
    if (!pendingResume) return;

    const data = pendingResume;
    setPendingResume(null);

    await saveCareerProfile({
      personalInfo: data.personalInfo,
      experience: data.experience,
      education: data.education,
      skills: data.skills,
      languages: data.languages,
      certifications: data.certifications,
      projects: data.projects,
      references: data.references,
    });

    await persistResume(data);
  };

  const handleResumeOnly = async function () {
    if (!pendingResume) return;

    const data = pendingResume;
    setPendingResume(null);

    await persistResume(data);
  };

  const handleInvalid = function () {
    const firstBad = BUILDER_STEPS.findIndex((step) => !!errors[step.id]);
    if (firstBad >= 0) {
      goToStep(firstBad);
      showToast(
        "error",
        `Check the ${BUILDER_STEPS[firstBad].label.toLowerCase()} section`,
      );
    }
  };

  if (
    (isFetchingTemplate && !fetchedTemplate) ||
    (isEditing && isFetchingResume && !resume)
  ) {
    return (
      <SafeAreaView className="bg-canvas flex-1 items-center justify-center">
        <ActivityIndicator color={accent} />
      </SafeAreaView>
    );
  }

  if (!template) {
    return (
      <SafeAreaView className="bg-canvas flex-1">
        <ScreenHeader title="Resume" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-10">
          <AppText type="title" className="text-center">
            Template not found
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  const step = BUILDER_STEPS[activeStep];
  const values = watch();

  return (
    <SafeAreaView className="bg-canvas flex-1">
      <ScreenHeader
        title={isEditing ? "Edit resume" : "Build resume"}
        onBack={() => router.back()}
        right={
          <IconButton
            icon={showPreview ? "create-outline" : "eye-outline"}
            color={accent}
            onPress={() => setShowPreview((previous) => !previous)}
          />
        }
      />

      {showPreview ? (
        <BuilderPreview template={template} data={values} />
      ) : (
        <>
          <View className="py-4">
            <StepNav
              steps={BUILDER_STEPS}
              activeIndex={activeStep}
              furthestIndex={furthestStep}
              accent={accent}
              onSelectStep={goToStep}
            />
          </View>

          <KeyboardAwareScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={20}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row items-center gap-2">
              <AppText type="title">{step.label}</AppText>
              {step.optional && (
                <View className="bg-surface-muted rounded-full px-2 py-0.5">
                  <AppText type="caption">Optional</AppText>
                </View>
              )}
            </View>

            <AppText type="caption" className="mb-4 mt-1">
              Step {activeStep + 1} of {BUILDER_STEPS.length}
            </AppText>

            <BuilderStepContent
              stepId={step.id}
              {...(!isEditing && {
                prefill: (
                  <PrefillCard
                    hasProfile={hasCareerProfile}
                    onPrefill={handlePrefillPress}
                    onSetUpProfile={handleSetUpProfile}
                  />
                ),
              })}
              control={control}
              errors={errors}
              setValue={setValue}
              experience={experience}
              education={education}
              skills={skills}
              projects={projects}
              certifications={certifications}
              languages={languages}
              references={references}
            />
          </KeyboardAwareScrollView>

          <BuilderFooter
            isFirst={activeStep === 0}
            isLast={activeStep === BUILDER_STEPS.length - 1}
            isOptionalStep={step.optional}
            isSaving={isSaving}
            isEditing={isEditing}
            accent={accent}
            onPrevious={() => goToStep(Math.max(activeStep - 1, 0))}
            onNext={handleNext}
            onSkip={handleSkip}
            onSave={handleSubmit(handleSave, handleInvalid)}
          />
        </>
      )}

      <ConfirmDialog
        visible={isPrefillConfirmVisible}
        title="Replace what you have typed?"
        message="Prefilling overwrites every section of this resume with your saved career profile."
        confirmLabel="Prefill"
        cancelLabel="Keep editing"
        onConfirm={handlePrefill}
        onCancel={() => setIsPrefillConfirmVisible(false)}
      />

      <ConfirmDialog
        visible={!!pendingResume}
        title="Save this as your career profile?"
        message="Keep these details on file and every resume you build after this one starts already filled in."
        confirmLabel="Save both"
        cancelLabel="Just the resume"
        isLoading={isSaving || isSavingCareerProfile}
        onConfirm={handleSaveBoth}
        onCancel={handleResumeOnly}
      />
    </SafeAreaView>
  );
}
