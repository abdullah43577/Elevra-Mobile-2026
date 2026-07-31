import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatTime } from "@/provider/utils";

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

  return (
    <View className="mb-4 mt-4 w-full items-center">
      <View className="flex-row items-center justify-center space-x-4">
        <TouchableOpacity
          onPress={onPlayPause}
          className="h-14 w-14 items-center justify-center rounded-full bg-[#2563EB]"
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <View className="mt-2 flex-row items-center justify-center space-x-2">
        <Text className="font-mono text-sm text-gray-500">
          {formatTime(displayTime)}
        </Text>
        <Text className="text-sm text-gray-300">/</Text>
        <Text className="font-mono text-sm text-gray-500">
          {formatTime(displayDuration)}
        </Text>
      </View>
      {/* Progress bar */}
      {totalDuration > 0 && (
        <View className="mt-3 h-1 w-full overflow-hidden rounded-full bg-gray-200">
          <View
            className="h-full rounded-full bg-[#2563EB]"
            style={{ width: `${(displayTime / totalDuration) * 100}%` }}
          />
        </View>
      )}
    </View>
  );
}
