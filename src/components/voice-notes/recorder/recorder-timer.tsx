import { AppText } from "@/components/shared/app-text";
import { formatTime } from "@/provider/utils";
import { View } from "react-native";

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
  if (isUploadedFile) return null;

  return (
    <View className="mb-10 items-center">
      <AppText className="font-bricolage-bold text-[56px] leading-[64px] tracking-tight text-primary-500">
        {formatTime(elapsedTime)}
      </AppText>

      <View className="mt-2 h-6 flex-row items-center gap-2">
        {isRecording && (
          <>
            <View className="h-2 w-2 rounded-full bg-error-500" />
            <AppText
              type="caption"
              className="font-bricolage-semibold text-error-500"
            >
              Recording
            </AppText>
          </>
        )}
      </View>
    </View>
  );
}
