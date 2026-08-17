import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { formatTime } from "@/provider/utils";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface RecorderPlaybackProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  duration: number;
  currentTime?: number;
  totalDuration?: number;
}

export function RecorderPlayback({
  isPlaying,
  onPlayPause,
  duration,
  currentTime = 0,
  totalDuration = 0,
}: RecorderPlaybackProps) {
  const displayDuration = totalDuration > 0 ? totalDuration : duration;
  const displayTime = totalDuration > 0 ? currentTime : 0;
  const progress =
    displayDuration > 0
      ? Math.min((displayTime / displayDuration) * 100, 100)
      : 0;

  return (
    <View className="mb-6 w-full items-center rounded-2xl border-hairline border-line bg-surface p-5">
      <Pressable
        onPress={onPlayPause}
        className="items-center justify-center rounded-full active:opacity-80"
        style={{
          width: 52,
          height: 52,
          backgroundColor: `${CONTENT_COLORS.recording}14`,
        }}
      >
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={22}
          color={CONTENT_COLORS.recording}
        />
      </Pressable>

      <View className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-muted">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: CONTENT_COLORS.recording,
          }}
        />
      </View>

      <View className="mt-2 w-full flex-row justify-between">
        <AppText type="caption">{formatTime(displayTime)}</AppText>
        <AppText type="caption">{formatTime(displayDuration)}</AppText>
      </View>
    </View>
  );
}
