import { TemplatePreview } from "@/components/resume-studio/template-preview";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { Badge } from "@/components/shared/badge";
import { ScreenHeader } from "@/components/shared/screen-header";
import { useGetTemplateById } from "@/hooks/resume/use-get-template-by-id";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TemplateDetail() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("resume");
  const { width } = useWindowDimensions();

  const params = useLocalSearchParams<{ id: string }>();
  const templateId = params.id;

  const { template, isFetchingTemplate } = useGetTemplateById({ templateId });

  const handleUseTemplate = function () {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/resume-studio/resume-builder",
      params: { templateId },
    });
  };

  if (isFetchingTemplate && !template) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color={accent} />
      </SafeAreaView>
    );
  }

  if (!template) {
    return (
      <SafeAreaView className="flex-1 bg-canvas">
        <ScreenHeader title="Template" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-10">
          <AppText type="title" className="text-center">
            Template not found
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader title={template.name} onBack={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/*
          The preview must sit on its own white page regardless of app theme —
          this wrapper previously had no background, so in dark mode the resume
          rendered dark grey text straight onto the dark surface.
        */}
        <View className="items-center px-5 pt-5">
          <View className="overflow-hidden rounded-2xl border-hairline border-line bg-white">
            <TemplatePreview template={template} width={width - 40} />
          </View>
        </View>

        <View className="px-5 pt-6">
          <AppText type="title">{template.name}</AppText>
          <AppText type="subtitle" className="mt-1.5">
            {template.description}
          </AppText>

          <View className="mt-3 flex-row items-center gap-2">
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: `${accent}1F` }}
            >
              <AppText type="caption" className="capitalize" style={{ color: accent }}>
                {template.category}
              </AppText>
            </View>
            {template.isPremium && <Badge label="Pro" variant="secondary" />}
          </View>

          <View
            className="mt-6 rounded-2xl border-hairline border-line bg-surface p-4"
            style={{ borderLeftWidth: 3, borderLeftColor: accent }}
          >
            <AppText type="label">ATS-friendly</AppText>
            <AppText type="subtitle" className="mt-1">
              Single column, standard section headings, and selectable text
              throughout — the three things applicant tracking systems need to
              read a resume correctly.
            </AppText>
          </View>

          <AppButton
            type="submit"
            label="Use this template"
            onPress={handleUseTemplate}
            className="mt-6"
            style={{ backgroundColor: accent }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
