import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { formatTime } from "@/provider/utils";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface PlaybackControlsProps {
  isPlaying: boolean;
  /** Track has reached the end — the button becomes a replay affordance. */
  isFinished?: boolean;
  /** Source is still loading, so seeking is not meaningful yet. */
  isLoading?: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
}

const ACCENT = CONTENT_COLORS.recording;

export function PlaybackControls({
  isPlaying,
  isFinished = false,
  isLoading = false,
  progress,
  currentTime,
  duration,
  onPlayPause,
  onSeekBackward,
  onSeekForward,
}: PlaybackControlsProps) {
  const playIcon = isPlaying ? "pause" : isFinished ? "refresh" : "play";
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View className="rounded-3xl border-hairline border-line bg-surface p-6">
      <View className="h-1 w-full overflow-hidden rounded-full bg-surface-muted">
        <View
          className="h-full rounded-full"
          style={{ width: `${clampedProgress}%`, backgroundColor: ACCENT }}
        />
      </View>

      <View className="mt-2.5 flex-row justify-between">
        <AppText type="caption">{formatTime(currentTime)}</AppText>
        <AppText type="caption">{formatTime(duration)}</AppText>
      </View>

      <View className="mt-6 flex-row items-center justify-center gap-7">
        <Pressable
          onPress={onSeekBackward}
          disabled={isLoading}
          hitSlop={8}
          className="active:opacity-60"
        >
          <Ionicons
            name="play-back"
            size={22}
            color={isLoading ? "#D5D5DE" : "#7D7D8A"}
          />
        </Pressable>

        <Pressable
          onPress={onPlayPause}
          className="items-center justify-center rounded-full active:opacity-80"
          style={{
            width: 68,
            height: 68,
            backgroundColor: ACCENT,
            shadowColor: ACCENT,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Ionicons name={playIcon} size={30} color="white" />
        </Pressable>

        <Pressable
          onPress={onSeekForward}
          disabled={isLoading}
          hitSlop={8}
          className="active:opacity-60"
        >
          <Ionicons
            name="play-forward"
            size={22}
            color={isLoading ? "#D5D5DE" : "#7D7D8A"}
          />
        </Pressable>
      </View>
    </View>
  );
}
