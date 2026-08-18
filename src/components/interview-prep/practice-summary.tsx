import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { STATUS_META } from "@/constants/interview-prep";
import { formatDuration } from "@/utils/interview-prep";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

interface Props {
  rehearsed: number;
  ready: number;
  needsWork: number;
  totalSeconds: number;
  accent: string;
  onPractiseFlagged: () => void;
  onDone: () => void;
}

export const PracticeSummary = function ({
  rehearsed,
  ready,
  needsWork,
  totalSeconds,
  accent,
  onPractiseFlagged,
  onDone,
}: Props) {
  const averageSeconds = rehearsed > 0 ? Math.round(totalSeconds / rehearsed) : 0;

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View
        className="mb-5 items-center justify-center rounded-full"
        style={{ width: 64, height: 64, backgroundColor: `${accent}1F` }}
      >
        <Ionicons name="checkmark-done" size={28} color={accent} />
      </View>

      <AppText type="title" className="text-center text-[20px] leading-[26px]">
        {rehearsed} rehearsed
      </AppText>
      <AppText type="subtitle" className="mt-1.5 text-center">
        {formatDuration(totalSeconds)} total, about {formatDuration(averageSeconds)}{" "}
        per answer
      </AppText>

      <View className="mt-7 w-full flex-row gap-3">
        <View className="flex-1 items-center rounded-2xl border-hairline border-line bg-surface py-4">
          <AppText
            type="title"
            className="text-[20px]"
            style={{ color: STATUS_META.READY.color }}
          >
            {ready}
          </AppText>
          <AppText type="caption" className="mt-0.5">
            Ready
          </AppText>
        </View>

        <View className="flex-1 items-center rounded-2xl border-hairline border-line bg-surface py-4">
          <AppText
            type="title"
            className="text-[20px]"
            style={{ color: STATUS_META.NEEDS_WORK.color }}
          >
            {needsWork}
          </AppText>
          <AppText type="caption" className="mt-0.5">
            Needs work
          </AppText>
        </View>
      </View>

      {needsWork > 0 && (
        <AppButton
          type="submit"
          label={`Run the ${needsWork} you flagged`}
          onPress={onPractiseFlagged}
          className="mt-7 w-full"
          style={{ backgroundColor: accent }}
        />
      )}

      <AppButton
        type="secondary"
        label="Done"
        onPress={onDone}
        className="mt-3 w-full"
      />
    </View>
  );
};
