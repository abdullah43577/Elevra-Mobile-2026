import { View } from "react-native";
import { AppText } from "@/components/shared/app-text";

interface RecorderTimerProps {
  elapsedTime: number;
  isRecording: boolean;
  isUploadedFile: boolean;
}

export function RecorderTimer({
  elapsedTime,
  isRecording,
  isUploadedFile,
}: RecorderTimerProps) {
  const formatTime = function (seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Don't show timer for uploaded files
  if (isUploadedFile) {
    return null;
  }

  return (
    <View className="items-center">
      <AppText className="mb-8 text-6xl font-bold text-gray-900">
        {formatTime(elapsedTime)}
      </AppText>

      {/* Recording Status Indicator */}
      {isRecording && (
        <View className="mb-4 flex-row items-center gap-2">
          <View className="h-3 w-3 rounded-full bg-red-500" />
          <AppText className="text-sm text-red-500">Recording...</AppText>
        </View>
      )}
    </View>
  );
}
