import { AppText } from "@/components/shared/app-text";
import {
  ANSWER_LONG_SECONDS,
  ANSWER_TARGET_SECONDS,
  CATEGORY_META,
} from "@/constants/interview-prep";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { answerOf, formatDuration } from "@/utils/interview-prep";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, View } from "react-native";
import { InterviewQuestion } from "../../../types/interview-prep";

interface Props {
  question: InterviewQuestion;
  index: number;
  total: number;
  seconds: number;
  isRevealed: boolean;
  accent: string;
  onReveal: () => void;
}

export const PracticeCard = function ({
  question,
  index,
  total,
  seconds,
  isRevealed,
  accent,
  onReveal,
}: Props) {
  const { foregroundMuted, danger } = useThemeColors();
  const answer = answerOf(question);
  const category = CATEGORY_META[question.category];

  /*
    The timer is the single most useful signal in rehearsal: rambling is the
    most common way a good answer goes wrong, and you cannot feel it happening.
    It is guidance, not a limit — hence a colour shift rather than a cut-off.
  */
  const timerColour =
    seconds >= ANSWER_LONG_SECONDS
      ? danger
      : seconds >= ANSWER_TARGET_SECONDS
        ? "#C4761C"
        : foregroundMuted;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between">
        <AppText type="caption">
          {index + 1} of {total} · {category.short}
        </AppText>
        <AppText type="label" style={{ color: timerColour }}>
          {formatDuration(seconds)}
        </AppText>
      </View>

      <AppText type="title" className="mt-5 text-[22px] leading-[30px]">
        {question.text}
      </AppText>

      {!!question.guidance && (
        <View
          className="mt-5 rounded-2xl p-4"
          style={{ backgroundColor: `${accent}14` }}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="bulb-outline" size={15} color={accent} />
            <AppText type="caption" style={{ color: accent }}>
              What a strong answer covers
            </AppText>
          </View>
          <AppText type="body" className="mt-1.5 text-[14px] leading-[20px]">
            {question.guidance}
          </AppText>
        </View>
      )}

      {/*
        Your own notes stay hidden until you ask for them. Rehearsal is recall —
        reading the answer you already wrote is the browsable-bank failure mode
        this screen exists to avoid.
      */}
      <View className="mt-6">
        {isRevealed ? (
          <View className="rounded-2xl border-hairline border-line bg-surface p-4">
            <AppText type="caption" className="mb-1.5">
              Your notes
            </AppText>
            <AppText type="body" className="text-[15px] leading-[22px]">
              {answer?.text?.trim() || "You have not written an answer for this one yet."}
            </AppText>
          </View>
        ) : (
          <Pressable
            onPress={onReveal}
            className="flex-row items-center justify-center gap-2 rounded-2xl border-hairline border-line bg-surface px-4 py-3.5 active:bg-surface-muted"
          >
            <Ionicons name="eye-outline" size={16} color={foregroundMuted} />
            <AppText type="label" className="text-foreground-muted">
              Answer first, then reveal your notes
            </AppText>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};
