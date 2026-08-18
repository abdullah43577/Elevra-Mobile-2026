import { AppText } from "@/components/shared/app-text";
import { STATUS_META } from "@/constants/interview-prep";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { formatDuration } from "@/utils/interview-prep";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

interface Props {
  isRecording: boolean;
  isUploading: boolean;
  recordSeconds: number;
  isLast: boolean;
  accent: string;
  onToggleRecord: () => void;
  onRate: (status: "NEEDS_WORK" | "READY") => void;
}

/*
  Rating is the step that makes the next session smarter: "needs work" pushes a
  question back to the front of the queue, "got it" lets it fall behind the ones
  you are avoiding. Skipping the rating is allowed — the runner still records
  that the question was rehearsed.
*/
export const PracticeControls = function ({
  isRecording,
  isUploading,
  recordSeconds,
  isLast,
  accent,
  onToggleRecord,
  onRate,
}: Props) {
  const { danger } = useThemeColors();

  return (
    <View className="border-t-hairline border-line bg-surface px-5 pb-4 pt-3">
      <View className="flex-row items-center justify-center gap-3">
        <Pressable
          onPress={onToggleRecord}
          disabled={isUploading}
          className="h-12 w-12 items-center justify-center rounded-full active:opacity-80"
          style={{ backgroundColor: isRecording ? danger : `${accent}26` }}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={accent} />
          ) : (
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={20}
              color={isRecording ? "#FFFFFF" : accent}
            />
          )}
        </Pressable>

        <AppText type="caption" className="w-16">
          {isRecording ? formatDuration(recordSeconds) : "Record"}
        </AppText>
      </View>

      <View className="mt-3 flex-row gap-3">
        <Pressable
          onPress={() => onRate("NEEDS_WORK")}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-hairline px-4 py-3.5 active:opacity-70"
          style={{ borderColor: `${STATUS_META.NEEDS_WORK.color}66` }}
        >
          <Ionicons
            name={STATUS_META.NEEDS_WORK.icon}
            size={16}
            color={STATUS_META.NEEDS_WORK.color}
          />
          <AppText type="label" style={{ color: STATUS_META.NEEDS_WORK.color }}>
            Needs work
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => onRate("READY")}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl px-4 py-3.5 active:opacity-80"
          style={{ backgroundColor: STATUS_META.READY.color }}
        >
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          <AppText type="label" className="text-white">
            {isLast ? "Got it · finish" : "Got it"}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};
