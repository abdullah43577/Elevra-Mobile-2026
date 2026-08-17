import { useThemeColors } from "@/hooks/use-theme-colors";
import { TemplateRenderer } from "@/components/resume/template-renderer";
import { AppText } from "@/components/shared/app-text";
import { useGetTemplateById } from "@/hooks/resume/use-get-template-by-id";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TemplateDetail() {
  const { foregroundMuted } = useThemeColors();

  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const templateId = params.id;

  const { template, isFetchingTemplate } = useGetTemplateById({
    templateId,
  });

  const handleUseTemplate = function () {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/resume-studio/resume-builder",
      params: { templateId },
    });
  };

  if (isFetchingTemplate || !template) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-line px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color={foregroundMuted} />
        </TouchableOpacity>
        <AppText type="title" className="font-bricolage-semibold text-foreground">
          Template Preview
        </AppText>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1">
        {/* Preview */}
        <View className="p-4">
          <View className="overflow-hidden rounded-xl border border-line">
            <TemplateRenderer
              template={template}
              data={template.defaultData}
              isThumbnail={false}
            />
          </View>
        </View>

        {/* Info */}
        <View className="px-4">
          <AppText className="font-bricolage-bold text-xl text-foreground">
            {template.name}
          </AppText>
          <AppText type="subtitle" className="mt-1 text-foreground-muted">
            {template.description}
          </AppText>
          <View className="mt-2 flex-row items-center gap-2">
            <View className="rounded-full bg-surface-muted px-3 py-1">
              <AppText className="text-xs capitalize text-foreground-muted">
                {template.category}
              </AppText>
            </View>
            {template.isPremium && (
              <View className="rounded-full bg-yellow-100 px-3 py-1">
                <AppText className="text-xs text-yellow-700">★ Premium</AppText>
              </View>
            )}
          </View>
        </View>

        {/* Use Template Button */}
        <View className="p-4 pb-8">
          <TouchableOpacity
            onPress={handleUseTemplate}
            className="rounded-lg bg-accent py-4"
          >
            <AppText className="text-center font-bricolage-semibold text-white">
              Use This Template
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
