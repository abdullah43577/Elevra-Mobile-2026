import { ApplicationFormFields } from "@/components/job-tracker/application-form-fields";
import { AppButton } from "@/components/shared/app-button";
import { BottomSheetPicker } from "@/components/shared/bottom-sheet-picker";
import { ScreenHeader } from "@/components/shared/screen-header";
import { CONTENT_COLORS } from "@/constants/content-colors";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_META,
} from "@/constants/job-applications";
import { useGetApplicationById } from "@/hooks/job-applications/use-get-application-by-id";
import { useSaveApplication } from "@/hooks/job-applications/use-save-application";
import { useGetCoverLetters } from "@/hooks/cover-letters/use-get-cover-letters";
import { useGetResumes } from "@/hooks/resume/use-get-resumes";
import { useThemeColors } from "@/hooks/use-theme-colors";
import {
  JobApplicationFormValues,
  jobApplicationSchema,
} from "@/schemas/job-application/job-application";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ApplicationStatus,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  WorkArrangement,
} from "../../../../../../types/job-application";

type PickerTarget = "status" | "resume" | "coverLetter" | null;

const trimmed = function (value?: string) {
  const next = value?.trim();
  return next ? next : undefined;
};

const numeric = function (value?: string) {
  const next = trimmed(value);
  return next ? Number(next) : null;
};

export default function ApplicationForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { contentColor } = useThemeColors();
  const accent = contentColor("application");

  const isUpdate = !!id;
  const [picker, setPicker] = useState<PickerTarget>(null);

  const { application, isFetchingApplication } = useGetApplicationById({
    applicationId: id ?? "",
    shouldFetch: isUpdate,
  });

  const { resumes } = useGetResumes();
  const { coverLetters } = useGetCoverLetters();

  const { saveApplication, isSavingApplication } = useSaveApplication({
    ...(id && { applicationId: id }),
    onSuccess: () => router.back(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      company: "",
      role: "",
      location: "",
      workArrangement: null,
      jobUrl: "",
      source: "",
      salaryMin: "",
      salaryMax: "",
      salaryCurrency: "",
      status: "SAVED",
      notes: "",
      jobDescription: "",
      resumeId: null,
      coverLetterId: null,
    },
  });

  // Guarded by id: the query object changes identity on every background
  // refetch, and re-running this would wipe whatever the user has typed.
  const hydratedId = useRef<string | null>(null);

  useEffect(() => {
    if (!application || hydratedId.current === application.id) return;
    hydratedId.current = application.id;

    reset({
      company: application.company,
      role: application.role,
      location: application.location ?? "",
      workArrangement: application.workArrangement ?? null,
      jobUrl: application.jobUrl ?? "",
      source: application.source ?? "",
      salaryMin: application.salaryMin ? String(application.salaryMin) : "",
      salaryMax: application.salaryMax ? String(application.salaryMax) : "",
      salaryCurrency: application.salaryCurrency ?? "",
      status: application.status,
      notes: application.notes ?? "",
      jobDescription: application.jobDescription ?? "",
      resumeId: application.resumeId ?? null,
      coverLetterId: application.coverLetterId ?? null,
    });
  }, [application]);

  const status = watch("status");
  const workArrangement = watch("workArrangement");
  const resumeId = watch("resumeId");
  const coverLetterId = watch("coverLetterId");

  const resumeLabel =
    resumes.find((resume) => resume.id === resumeId)?.title ?? null;

  const coverLetterLabel =
    coverLetters.find((letter) => letter.id === coverLetterId)?.title ?? null;

  const onSubmit = function (values: JobApplicationFormValues) {
    const payload: CreateApplicationRequest | UpdateApplicationRequest = {
      company: values.company.trim(),
      role: values.role.trim(),
      status: values.status,
      /*
        Every optional field sends an explicit null on update rather than
        being omitted. Omitting is how a field says "unchanged", which meant
        emptying any of these saved nothing and the old value came straight
        back on the next fetch. Create cannot send null — the server's create
        schema rejects it — so the two paths differ.
      */
      ...(isUpdate
        ? {
            location: trimmed(values.location) ?? null,
            workArrangement: values.workArrangement || null,
            jobUrl: trimmed(values.jobUrl) ?? null,
            source: trimmed(values.source) ?? null,
            salaryMin: numeric(values.salaryMin),
            salaryMax: numeric(values.salaryMax),
            salaryCurrency:
              trimmed(values.salaryCurrency)?.toUpperCase() ?? null,
            notes: trimmed(values.notes) ?? null,
            jobDescription: trimmed(values.jobDescription) ?? null,
          }
        : {
            ...(trimmed(values.location) && {
              location: trimmed(values.location),
            }),
            ...(values.workArrangement && {
              workArrangement: values.workArrangement,
            }),
            ...(trimmed(values.jobUrl) && { jobUrl: trimmed(values.jobUrl) }),
            ...(trimmed(values.source) && { source: trimmed(values.source) }),
            ...(trimmed(values.salaryMin) && {
              salaryMin: Number(values.salaryMin),
            }),
            ...(trimmed(values.salaryMax) && {
              salaryMax: Number(values.salaryMax),
            }),
            ...(trimmed(values.salaryCurrency) && {
              salaryCurrency: values.salaryCurrency?.trim().toUpperCase(),
            }),
            ...(trimmed(values.notes) && { notes: trimmed(values.notes) }),
            ...(trimmed(values.jobDescription) && {
              jobDescription: trimmed(values.jobDescription),
            }),
          }),
      ...(values.resumeId && { resumeId: values.resumeId }),
      ...(values.coverLetterId && { coverLetterId: values.coverLetterId }),
    };

    saveApplication(payload);
  };

  if (isUpdate && isFetchingApplication && !application) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color={accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader
        title={isUpdate ? "Edit application" : "New application"}
        onBack={() => router.back()}
        backIcon="close"
      />

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <ApplicationFormFields
          control={control}
          errors={errors}
          status={status}
          workArrangement={workArrangement}
          resumeLabel={resumeLabel}
          coverLetterLabel={coverLetterLabel}
          accentColor={accent}
          onOpenStatusPicker={() => setPicker("status")}
          onOpenResumePicker={() => setPicker("resume")}
          onOpenCoverLetterPicker={() => setPicker("coverLetter")}
          onSelectWorkArrangement={(value) =>
            setValue("workArrangement", value, { shouldDirty: true })
          }
        />

        <View className="mt-8">
          <AppButton
            type="submit"
            label={isUpdate ? "Save changes" : "Add application"}
            onPress={handleSubmit(onSubmit)}
            isLoading={isSavingApplication}
            style={{ backgroundColor: accent }}
          />
        </View>
      </KeyboardAwareScrollView>

      <BottomSheetPicker
        visible={picker === "status"}
        title="Select status"
        selectedValue={status}
        showSearch={false}
        accentColor={accent}
        options={APPLICATION_STATUSES.map((option) => ({
          label: APPLICATION_STATUS_META[option].label,
          value: option,
        }))}
        onSelect={(value) =>
          setValue("status", value as ApplicationStatus, { shouldDirty: true })
        }
        onClose={() => setPicker(null)}
      />

      <BottomSheetPicker
        visible={picker === "resume"}
        title="Attach a resume"
        selectedValue={resumeId ?? null}
        accentColor={CONTENT_COLORS.resume}
        searchPlaceholder="Search resumes..."
        emptyLabel="You have no saved resumes yet"
        options={resumes.map((resume) => ({
          label: resume.title,
          value: resume.id,
        }))}
        onSelect={(value) => setValue("resumeId", value, { shouldDirty: true })}
        onClose={() => setPicker(null)}
      />

      <BottomSheetPicker
        visible={picker === "coverLetter"}
        title="Attach a cover letter"
        selectedValue={coverLetterId ?? null}
        accentColor={CONTENT_COLORS.letter}
        searchPlaceholder="Search cover letters..."
        emptyLabel="You have no cover letters yet"
        options={coverLetters.map((letter) => ({
          label: letter.title,
          value: letter.id,
        }))}
        onSelect={(value) =>
          setValue("coverLetterId", value, { shouldDirty: true })
        }
        onClose={() => setPicker(null)}
      />
    </SafeAreaView>
  );
}
