import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface Props {
  onPress: () => void;
}

/*
  Points at where the two AI features live, since neither is on this screen:
  job-specific questions are generated from an application's posting, and
  feedback comes from recording a take on any question. It replaced an inert
  "Soon" card once both shipped.
*/
export const AiQuestionsCard = function ({ onPress }: Props) {
  const { contentTint } = useThemeColors();
  const tint = contentTint("interview");

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border-hairline border-line p-4 active:opacity-70"
      style={{ backgroundColor: tint.surface }}
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 36, height: 36, backgroundColor: tint.holder }}
      >
        <Ionicons name="sparkles-outline" size={18} color={tint.color} />
      </View>

      <View className="flex-1">
        <AppText type="label">Questions for a specific job</AppText>
        <AppText type="caption" className="mt-0.5">
          Generate them from an application. Record any answer to get feedback on it.
        </AppText>
      </View>

      <Ionicons name="chevron-forward" size={16} color={tint.color} />
    </Pressable>
  );
};
