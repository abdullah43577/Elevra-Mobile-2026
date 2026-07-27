import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";

interface PlaybackControlsProps {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
}

export function PlaybackControls({
  isPlaying,
  progress,
  currentTime,
  duration,
  onPlayPause,
  onSeekBackward,
  onSeekForward,
}: PlaybackControlsProps) {
  const formatDuration = function (seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View className="items-center rounded-xl bg-gray-50 p-6">
      {/* Progress Bar */}
      <View className="relative h-1 w-full rounded-full bg-gray-300">
        <View
          className="absolute h-1 rounded-full bg-blue-500"
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Time Labels */}
      <View className="mt-2 w-full flex-row justify-between">
        <AppText className="text-xs text-gray-500">
          {formatDuration(currentTime || 0)}
        </AppText>
        <AppText className="text-xs text-gray-500">
          {formatDuration(duration || 0)}
        </AppText>
      </View>

      {/* Play/Pause Button */}
      <TouchableOpacity
        onPress={onPlayPause}
        className="mt-6 h-20 w-20 items-center justify-center rounded-full bg-blue-500"
      >
        <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" />
      </TouchableOpacity>

      {/* Seek Controls */}
      <View className="mt-4 flex-row gap-6">
        <TouchableOpacity onPress={onSeekBackward}>
          <Ionicons name="play-back-outline" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSeekForward}>
          <Ionicons name="play-forward-outline" size={28} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
