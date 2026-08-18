import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

/*
  The AI surface, deliberately inert. Generating role-specific questions from a
  job description, and critiquing a recorded answer, are the two obvious AI
  features here — and both stay gated until the AI backend exists.

  This is also why the seeded bank is category-tagged rather than role-tagged:
  role-specific questions are AI's job, not a hand-curated catalogue's.
*/
export const AiQuestionsCard = function () {
  const { foregroundMuted } = useThemeColors();

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border-hairline border-line bg-surface-muted p-4">
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 36, height: 36 }}
      >
        <Ionicons name="sparkles-outline" size={18} color={foregroundMuted} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <AppText type="label" className="text-foreground-muted">
            Questions for this role
          </AppText>
          <View className="rounded-full bg-surface px-2 py-0.5">
            <AppText type="caption">Soon</AppText>
          </View>
        </View>
        <AppText type="caption" className="mt-0.5">
          Generate questions from a job description, and get your answers critiqued
        </AppText>
      </View>
    </View>
  );
};
