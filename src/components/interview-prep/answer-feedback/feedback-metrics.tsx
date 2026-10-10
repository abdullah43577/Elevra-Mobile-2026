import { AppText } from "@/components/shared/app-text";
import { formatDuration } from "@/utils/interview-prep";
import { View } from "react-native";
import { AnswerFeedback } from "../../../../types/interview-prep";

interface Props {
  metrics: AnswerFeedback["metrics"];
}

const PACE_LABEL = { slow: "A little slow", steady: "Steady", fast: "Fast — slow down" } as const;
const LENGTH_LABEL = { short: "Short", good: "Good length", long: "Running long", too_long: "Too long" } as const;

const Stat = function ({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 rounded-xl bg-surface-muted px-3 py-2.5">
      <AppText type="label" numberOfLines={1}>
        {value}
      </AppText>
      <AppText type="caption" className="mt-0.5" numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
};

// Counted on the server from the transcript and the take's length — the same
// take always gives the same numbers.
export const FeedbackMetrics = function ({ metrics }: Props) {
  const topFillers = metrics.fillers
    .slice(0, 3)
    .map((filler) => `“${filler.word}” ×${filler.count}`)
    .join(", ");

  return (
    <View>
      <View className="flex-row gap-2">
        <Stat
          value={metrics.wordsPerMinute ? `${metrics.wordsPerMinute} wpm` : "—"}
          label={metrics.pace ? PACE_LABEL[metrics.pace] : "Pace"}
        />
        <Stat value={String(metrics.fillerCount)} label={metrics.fillerCount === 1 ? "Filler word" : "Filler words"} />
        <Stat
          value={metrics.durationSeconds ? formatDuration(metrics.durationSeconds) : "—"}
          label={metrics.length ? LENGTH_LABEL[metrics.length] : "Length"}
        />
      </View>

      {topFillers.length > 0 && (
        <AppText type="caption" className="mt-2">
          Most used: {topFillers}
        </AppText>
      )}
    </View>
  );
};
