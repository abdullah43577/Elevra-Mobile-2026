import { View } from "react-native";
import { AppText } from "@/components/shared/app-text";
import { formatTime } from "@/provider/utils";

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
