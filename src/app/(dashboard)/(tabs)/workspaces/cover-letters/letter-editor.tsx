import { AiDraftCard } from "@/components/cover-letters/ai-draft-card";
import { LetterFormBody } from "@/components/cover-letters/letter-form-body";
import { LetterFormRecipient } from "@/components/cover-letters/letter-form-recipient";
import { LetterFormSender } from "@/components/cover-letters/letter-form-sender";
import { LetterPreview } from "@/components/cover-letters/letter-preview";
import { LetterTemplateRow } from "@/components/cover-letters/letter-template-row";
import { AppButton } from "@/components/shared/app-button";
import { BottomSheetPicker } from "@/components/shared/bottom-sheet-picker";
import { IconButton } from "@/components/shared/icon-button";
import { ScreenHeader } from "@/components/shared/screen-header";
import { useGetCareerProfile } from "@/hooks/career-profile/use-get-career-profile";
import { useGetCoverLetterById } from "@/hooks/cover-letters/use-get-cover-letter-by-id";
import { useSaveCoverLetter } from "@/hooks/cover-letters/use-save-cover-letter";
import { useGetTemplates } from "@/hooks/resume/use-get-templates";
import { useThemeColors } from "@/hooks/use-theme-colors";
import {
  CoverLetterFormValues,
  coverLetterSchema,
  DEFAULT_CLOSING,
} from "@/schemas/cover-letter/cover-letter";
import { showToast } from "@/utils/show-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const EMPTY_FORM: CoverLetterFormValues = {
  company: "",
  role: "",
  recipientName: "",
  recipientTitle: "",
  companyAddress: "",
  body: "",
  closing: DEFAULT_CLOSING,
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
  },
};

export default function LetterEditor() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("letter");

  const { coverLetterId } = useLocalSearchParams<{ coverLetterId?: string }>();
  const isEditing = !!coverLetterId;

  const [templateId, setTemplateId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isTemplatePickerVisible, setIsTemplatePickerVisible] = useState(false);

  const { templates, isFetchingTemplates } = useGetTemplates({});
  const { coverLetter, isFetchingCoverLetter } = useGetCoverLetterById({
    coverLetterId: coverLetterId ?? "",
  });
  const { careerProfile, hasCareerProfile } = useGetCareerProfile();
  const { saveCoverLetter, isSavingCoverLetter } = useSaveCoverLetter({
    ...(coverLetterId && { coverLetterId }),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: EMPTY_FORM,
  });

  // Guarded by id: the query object changes identity on every background
  // refetch, and re-running this would wipe whatever the user has typed.
  const hydratedId = useRef<string | null>(null);

  useEffect(() => {
    if (!coverLetter || !isEditing || hydratedId.current === coverLetter.id) return;
    hydratedId.current = coverLetter.id;

    setTemplateId(coverLetter.templateId);
    reset({
      company: coverLetter.company,
      role: coverLetter.role,
      recipientName: coverLetter.recipientName ?? "",
      recipientTitle: coverLetter.recipientTitle ?? "",
      companyAddress: coverLetter.companyAddress ?? "",
      body: coverLetter.body,
      closing: coverLetter.closing ?? DEFAULT_CLOSING,
      personalInfo: {
        firstName: coverLetter.personalInfo?.firstName ?? "",
        lastName: coverLetter.personalInfo?.lastName ?? "",
        email: coverLetter.personalInfo?.email ?? "",
        phone: coverLetter.personalInfo?.phone ?? "",
        location: coverLetter.personalInfo?.location ?? "",
        title: coverLetter.personalInfo?.title ?? "",
      },
    });
  }, [coverLetter, isEditing]);

  // A new letter needs some template chosen before it can render a preview.
  useEffect(() => {
    if (templateId || isEditing || templates.length === 0) return;
    setTemplateId(templates[0].id);
  }, [templates, templateId, isEditing]);

  const handlePrefillSender = function () {
    const info = careerProfile?.personalInfo;
    if (!info) return;

    setValue("personalInfo", {
      firstName: info.firstName ?? "",
      lastName: info.lastName ?? "",
      email: info.email ?? "",
      phone: info.phone ?? "",
      location: info.location ?? "",
      title: info.title ?? "",
    });

    showToast("success", "Filled from your career profile");
  };

  const handleSave = async function (data: CoverLetterFormValues) {
    if (!templateId) {
      showToast("error", "Choose a template first");
      return;
    }

    await saveCoverLetter({
      templateId,
      company: data.company,
      role: data.role,
      body: data.body,
      personalInfo: data.personalInfo,
      /*
        On update an emptied field sends an explicit null. Omitting it is how
        every other field says "unchanged", so clearing a recipient name saved
        nothing and the old name came back on the next fetch — the same trap the
        application form had. Create cannot send null; the server rejects it.
      */
      ...(isEditing
        ? {
            recipientName: data.recipientName?.trim() || null,
            recipientTitle: data.recipientTitle?.trim() || null,
            companyAddress: data.companyAddress?.trim() || null,
            closing: data.closing?.trim() || null,
          }
        : {
            ...(data.recipientName && { recipientName: data.recipientName }),
            ...(data.recipientTitle && { recipientTitle: data.recipientTitle }),
            ...(data.companyAddress && { companyAddress: data.companyAddress }),
            ...(data.closing && { closing: data.closing }),
          }),
    });
  };

  const values = watch();
  const template = templates.find((item) => item.id === templateId);
  const isFirstLoad =
    isFetchingTemplates || (isEditing && isFetchingCoverLetter && !coverLetter);

  if (isFirstLoad) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color={accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader
        title={isEditing ? "Edit cover letter" : "New cover letter"}
        onBack={() => router.back()}
        right={
          <IconButton
            icon={showPreview ? "create-outline" : "eye-outline"}
            color={accent}
            onPress={() => setShowPreview((previous) => !previous)}
          />
        }
      />

      {showPreview && template ? (
        <LetterPreview
          letter={{ ...values, letterDate: coverLetter?.letterDate ?? new Date().toISOString() }}
          template={template}
        />
      ) : (
        <>
          <KeyboardAwareScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={20}
            showsVerticalScrollIndicator={false}
          >
            <View className="mt-4">
              <AiDraftCard />
            </View>

            <View className="mt-8">
              <LetterTemplateRow
                {...(template && { template })}
                accent={accent}
                onPress={() => setIsTemplatePickerVisible(true)}
              />
            </View>

            <View className="mt-8">
              <LetterFormSender
                control={control}
                errors={errors}
                canPrefill={hasCareerProfile}
                onPrefill={handlePrefillSender}
              />
            </View>

            <View className="mt-8">
              <LetterFormRecipient control={control} errors={errors} />
            </View>

            <View className="mt-8">
              <LetterFormBody
                control={control}
                errors={errors}
                closing={values.closing ?? DEFAULT_CLOSING}
                accent={accent}
                onSelectClosing={(value) => setValue("closing", value)}
              />
            </View>
          </KeyboardAwareScrollView>

          <View className="border-t-hairline border-line bg-surface px-5 py-4">
            <AppButton
              type="submit"
              label={isEditing ? "Save changes" : "Create cover letter"}
              onPress={handleSubmit(handleSave)}
              isLoading={isSavingCoverLetter}
              style={{ backgroundColor: accent }}
            />
          </View>
        </>
      )}

      <BottomSheetPicker
        visible={isTemplatePickerVisible}
        selectedValue={templateId}
        options={templates.map((item) => ({
          label: item.name,
          value: item.id,
          ...(item.description && { description: item.description }),
        }))}
        title="Choose a template"
        accentColor={accent}
        onSelect={setTemplateId}
        onClose={() => setIsTemplatePickerVisible(false)}
      />
    </SafeAreaView>
  );
}
