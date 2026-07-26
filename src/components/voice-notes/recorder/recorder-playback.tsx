import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";

interface RecorderPlaybackProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  duration: number;
}

export function RecorderPlayback({
  isPlaying,
  onPlayPause,
  duration,
}: RecorderPlaybackProps) {
  const formatTime = function (seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View className="mb-4 flex-row items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
      <TouchableOpacity onPress={onPlayPause}>
        <Ionicons
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={32}
          color="#3B82F6"
        />
      </TouchableOpacity>
      <AppText className="text-sm text-gray-600">
        {formatTime(duration)}
      </AppText>
      <AppText className="text-xs text-gray-400">|</AppText>
      <AppText className="text-xs text-gray-400">Ready to save</AppText>
    </View>
  );
}
