import { AppText } from "@/components/shared/app-text";
import { formatTime } from "@/provider/utils";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

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
    <View className="items-center rounded-xl bg-gray-50 p-6">
      {/* Progress Bar */}
      <View className="relative h-1 w-full rounded-full bg-gray-300">
        <View
          className="absolute h-1 rounded-full bg-blue-500"
          style={{ width: `${clampedProgress}%` }}
        />
      </View>

      {/* Time Labels */}
      <View className="mt-2 w-full flex-row justify-between">
        <AppText className="text-xs text-gray-500">
          {formatTime(currentTime)}
        </AppText>
        <AppText className="text-xs text-gray-500">
          {formatTime(duration)}
        </AppText>
      </View>

      {/* Play/Pause Button */}
      <TouchableOpacity
        onPress={onPlayPause}
        className="mt-6 h-20 w-20 items-center justify-center rounded-full bg-blue-500"
      >
        <Ionicons name={playIcon} size={40} color="white" />
      </TouchableOpacity>

      {/* Seek Controls */}
      <View className="mt-4 flex-row gap-6">
        <TouchableOpacity onPress={onSeekBackward} disabled={isLoading}>
          <Ionicons
            name="play-back-outline"
            size={28}
            color={isLoading ? "#D1D5DB" : "#6B7280"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSeekForward} disabled={isLoading}>
          <Ionicons
            name="play-forward-outline"
            size={28}
            color={isLoading ? "#D1D5DB" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
