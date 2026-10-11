import { ImportNotice } from "@/components/career-profile/import-notice";
import { ProfileEditorFooter } from "@/components/career-profile/profile-editor-footer";
import { BuilderStepContent } from "@/components/resume-studio/builder/builder-step-content";
import { StepNav } from "@/components/resume-studio/builder/step-nav";
import { AppText } from "@/components/shared/app-text";
import { ScreenHeader } from "@/components/shared/screen-header";
import { PROFILE_SECTIONS, ProfileSectionId } from "@/constants/career-profile";
import { useGetCareerProfile } from "@/hooks/career-profile/use-get-career-profile";
import { useSaveCareerProfile } from "@/hooks/career-profile/use-save-career-profile";
import { useGetProfile } from "@/hooks/use-get-profile";
import { useThemeColors } from "@/hooks/use-theme-colors";
import {
  ResumeBuilderFormValues,
  resumeBuilderSchema,
} from "@/schemas/resume-builder/resume-builder";
import { useProfileImportStore } from "@/store/profile-import";
import { ImportedProfile } from "../../../../../../types/career-profile";
import { toProfileFormValues } from "@/utils/career-profile";
import { showToast } from "@/utils/show-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileEditor() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("profile");

  const { section } = useLocalSearchParams<{ section?: ProfileSectionId }>();

  const initialIndex = Math.max(
    PROFILE_SECTIONS.findIndex((item) => item.id === section),
    0,
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const { profile } = useGetProfile();
  const { careerProfile, hasLoadedCareerProfile } = useGetCareerProfile();
  const { saveCareerProfile, isSavingCareerProfile } = useSaveCareerProfile({
    onSuccess: () => router.back(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ResumeBuilderFormValues>({
    resolver: zodResolver(resumeBuilderSchema),
    defaultValues: toProfileFormValues(),
  });

  const takeImportDraft = useProfileImportStore((state) => state.takeDraft);
  const [importReport, setImportReport] = useState<ImportedProfile["report"] | null>(null);

  // Hydrate once: the query object changes identity on every refetch. A pending
  // PDF import wins over the saved profile and is taken exactly once.
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!hasLoadedCareerProfile || hasHydrated.current) return;
    hasHydrated.current = true;

    const account = {
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      email: profile?.email,
    };
    const imported = takeImportDraft();

    reset(toProfileFormValues(imported?.profile ?? careerProfile, account));
    if (imported) setImportReport(imported.report);
  }, [hasLoadedCareerProfile, careerProfile, profile, reset, takeImportDraft]);

  const experience = useFieldArray({ control, name: "experience" });
  const education = useFieldArray({ control, name: "education" });
  const skills = useFieldArray({ control, name: "skills" });
  const languages = useFieldArray({ control, name: "languages" });
  const certifications = useFieldArray({ control, name: "certifications" });
  const projects = useFieldArray({ control, name: "projects" });
  const references = useFieldArray({ control, name: "references" });

  const handleSave = async function (data: ResumeBuilderFormValues) {
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
  };

  const handleInvalid = function () {
    const firstBad = PROFILE_SECTIONS.findIndex((item) => !!errors[item.id]);
    if (firstBad >= 0) {
      setActiveIndex(firstBad);
      showToast(
        "error",
        `Check the ${PROFILE_SECTIONS[firstBad].label.toLowerCase()} section`,
      );
    }
  };

  if (!hasLoadedCareerProfile) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color={accent} />
      </SafeAreaView>
    );
  }

  const activeSection = PROFILE_SECTIONS[activeIndex];

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader title="Career profile" onBack={() => router.back()} />

      {importReport && <ImportNotice report={importReport} />}

      <View className="py-4">
        <StepNav
          steps={PROFILE_SECTIONS}
          activeIndex={activeIndex}
          furthestIndex={PROFILE_SECTIONS.length - 1}
          accent={accent}
          onSelectStep={setActiveIndex}
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
        <AppText type="title">{activeSection.label}</AppText>
        <AppText type="caption" className="mb-4 mt-1">
          {activeSection.hint}
        </AppText>

        <BuilderStepContent
          stepId={activeSection.id}
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

      <ProfileEditorFooter
        isFirst={activeIndex === 0}
        isLast={activeIndex === PROFILE_SECTIONS.length - 1}
        isSaving={isSavingCareerProfile}
        accent={accent}
        onPrevious={() => setActiveIndex(Math.max(activeIndex - 1, 0))}
        onNext={() =>
          setActiveIndex(Math.min(activeIndex + 1, PROFILE_SECTIONS.length - 1))
        }
        onSave={handleSubmit(handleSave, handleInvalid)}
      />
    </SafeAreaView>
  );
}
