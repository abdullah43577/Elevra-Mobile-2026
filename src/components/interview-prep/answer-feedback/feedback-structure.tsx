import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { AnswerFeedback } from "../../../../types/interview-prep";

interface Props {
  structure: AnswerFeedback["structure"];
  accent: string;
}

const PARTS = [
  { key: "situation", label: "Situation" },
  { key: "task", label: "Task" },
  { key: "action", label: "Action" },
  { key: "result", label: "Result" },
] as const;

export const FeedbackStructure = function ({ structure, accent }: Props) {
  const { foregroundSubtle } = useThemeColors();
  if (!structure.applies) return null;

  return (
    <View className="mt-4">
      <AppText type="label">Story structure</AppText>
      <View className="mt-2 flex-row flex-wrap gap-x-4 gap-y-1.5">
        {PARTS.map((part) => {
          const covered = !!structure[part.key];
          return (
            <View key={part.key} className="flex-row items-center gap-1">
              <Ionicons
                name={covered ? "checkmark-circle" : "ellipse-outline"}
                size={15}
                color={covered ? accent : foregroundSubtle}
              />
              <AppText type="caption" className={covered ? "text-foreground" : undefined}>
                {part.label}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
};
