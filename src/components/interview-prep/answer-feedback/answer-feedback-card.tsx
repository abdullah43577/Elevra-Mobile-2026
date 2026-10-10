import { AppText } from "@/components/shared/app-text";
import { Badge } from "@/components/shared/badge";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";
import { InterviewAnswer } from "../../../../types/interview-prep";
import { ExpandableText } from "./expandable-text";
import { FeedbackMetrics } from "./feedback-metrics";
import { FeedbackStructure } from "./feedback-structure";

interface Props {
  answer: InterviewAnswer;
  accent: string;
  isPro: boolean;
  isCoaching: boolean;
  onCoach: () => void;
}

const SPECIFICITY_LABEL = { concrete: "Specific", mixed: "Partly specific", vague: "Too general" } as const;

export const AnswerFeedbackCard = function ({ answer, accent, isPro, isCoaching, onCoach }: Props) {
  const { foregroundInverse } = useThemeColors();
  const feedback = answer.feedback;

  if (!feedback) {
    return (
      <View className="rounded-2xl border-hairline border-line bg-surface p-4">
        <View className="flex-row items-center gap-2">
          <AppText type="label">Feedback on this take</AppText>
          {!isPro && <Badge label="Pro" />}
        </View>
        <AppText type="caption" className="mt-0.5">
          Your pace, filler words and structure, plus a tighter version in your own words.
        </AppText>

        <Pressable
          onPress={onCoach}
          disabled={isCoaching}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 active:opacity-80"
          style={{ backgroundColor: accent }}
        >
          {isCoaching ? (
            <ActivityIndicator size="small" color={foregroundInverse} />
          ) : (
            <Ionicons name="sparkles-outline" size={16} color={foregroundInverse} />
          )}
          <AppText type="label" style={{ color: foregroundInverse }}>
            {isCoaching ? "Listening to your take…" : "Get feedback"}
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="rounded-2xl border-hairline border-line bg-surface p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <AppText type="label">Feedback on this take</AppText>
        <AppText type="caption">{SPECIFICITY_LABEL[feedback.specificity]}</AppText>
      </View>

      <FeedbackMetrics metrics={feedback.metrics} />
      <FeedbackStructure structure={feedback.structure} accent={accent} />

      <View className="mt-4">
        <AppText type="label">What works</AppText>
        <AppText type="body" className="mt-1 text-[15px] leading-[22px]">
          {feedback.strongest}
        </AppText>
      </View>

      <View className="mt-3">
        <AppText type="label">The one thing to change</AppText>
        <AppText type="body" className="mt-1 text-[15px] leading-[22px]">
          {feedback.biggestFix}
        </AppText>
      </View>

      {feedback.tighterVersion && <ExpandableText label="Tighter version" text={feedback.tighterVersion} accent={accent} />}
      {answer.transcript && <ExpandableText label="Transcript" text={answer.transcript} accent={accent} />}

      <AppText type="caption" className="mt-4">
        Record a new take and you can get fresh feedback on it.
      </AppText>
    </View>
  );
};
