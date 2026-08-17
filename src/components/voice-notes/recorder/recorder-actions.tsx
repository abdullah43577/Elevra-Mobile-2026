import { useThemeColors } from "@/hooks/use-theme-colors";
import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

interface RecorderActionsProps {
  isRecording: boolean;
  isUploadedFile: boolean;
  isPicking: boolean;
  isSaving: boolean;
  onRecord: () => void;
  onStopRecording: () => void;
  onPickAudio: () => void;
}

export function RecorderActions({
  isRecording,
  isUploadedFile,
  isPicking,
  isSaving,
  onRecord,
  onStopRecording,
  onPickAudio,
}: RecorderActionsProps) {
  const { foregroundMuted } = useThemeColors();

  const statusText = isRecording
    ? "Tap to stop recording"
    : isUploadedFile
      ? "File ready to save"
      : "Record, or upload an audio file";

  const recordColor = isRecording ? "#B93A32" : CONTENT_COLORS.recording;

  return (
    <View className="items-center">
      <View className="flex-row items-center gap-5">
        <Pressable
          onPress={isRecording ? onStopRecording : onRecord}
          disabled={isSaving || isUploadedFile}
          className="items-center justify-center rounded-full active:opacity-80"
          style={{
            width: 84,
            height: 84,
            backgroundColor: recordColor,
            opacity: isSaving || isUploadedFile ? 0.4 : 1,
            shadowColor: recordColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={34}
            color="white"
          />
        </Pressable>

        <Pressable
          onPress={onPickAudio}
          disabled={isSaving || isRecording || isPicking}
          className="items-center justify-center rounded-full border-hairline border-line bg-surface active:opacity-70"
          style={{
            width: 64,
            height: 64,
            opacity: isSaving || isRecording ? 0.4 : 1,
          }}
        >
          {isPicking ? (
            <ActivityIndicator size="small" color={foregroundMuted} />
          ) : (
            <Ionicons
              name={isUploadedFile ? "checkmark" : "cloud-upload-outline"}
              size={24}
              color={isUploadedFile ? CONTENT_COLORS.resume : "#7D7D8A"}
            />
          )}
        </Pressable>
      </View>

      <AppText type="caption" className="mt-5">
        {statusText}
      </AppText>
    </View>
  );
}
