import { AppText } from "@/components/shared/app-text";
import { CATEGORY_META, STATUS_META } from "@/constants/interview-prep";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { answerOf } from "@/utils/interview-prep";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { InterviewQuestion } from "../../../types/interview-prep";

interface Props {
  question: InterviewQuestion;
  onPress: () => void;
}

export const QuestionRow = function ({ question, onPress }: Props) {
  const { foregroundSubtle } = useThemeColors();

  const answer = answerOf(question);
  const status = answer ? STATUS_META[answer.status] : null;
  const category = CATEGORY_META[question.category];

  const meta = [
    category.short,
    answer?.audioUrl ? "Recorded" : null,
    answer?.practiceCount ? `Rehearsed ${answer.practiceCount}x` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-start gap-3 px-4 py-3.5 active:bg-surface-muted"
    >
      <View style={{ paddingTop: 2 }}>
        <Ionicons
          name={status?.icon ?? "ellipse-outline"}
          size={18}
          color={status?.color ?? foregroundSubtle}
        />
      </View>

      <View className="flex-1">
        <AppText type="label" numberOfLines={2}>
          {question.text}
        </AppText>
        <AppText type="caption" className="mt-0.5">
          {meta}
        </AppText>
      </View>

      <View style={{ paddingTop: 2 }}>
        <Ionicons name="chevron-forward" size={18} color={foregroundSubtle} />
      </View>
    </Pressable>
  );
};
