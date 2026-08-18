import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

/*
  The AI surface, deliberately inert. Drafting a letter from the user's career
  profile and the role they are applying for is the obvious AI feature here, but
  every AI-dependent feature stays gated until the AI backend is ready.

  Not a Pressable: a control that looks live and silently does nothing is worse
  than one that admits it is not ready yet.
*/
export const AiDraftCard = function () {
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
            Draft with AI
          </AppText>
          <View className="rounded-full bg-surface px-2 py-0.5">
            <AppText type="caption">Soon</AppText>
          </View>
        </View>
        <AppText type="caption" className="mt-0.5">
          Turn your career profile and this role into a first draft
        </AppText>
      </View>
    </View>
  );
};
