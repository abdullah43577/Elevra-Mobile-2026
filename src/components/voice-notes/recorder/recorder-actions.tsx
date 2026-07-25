import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";

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
  const getStatusText = function () {
    if (isRecording) return "Tap to stop recording";
    if (isUploadedFile) return "File ready to save";
    return "Record or upload an audio file";
  };

  return (
    <View className="items-center">
      <View className="flex-row items-center gap-4">
        {/* Record Button */}
        <TouchableOpacity
          onPress={isRecording ? onStopRecording : onRecord}
          className={`h-20 w-20 items-center justify-center rounded-full ${
            isRecording ? "bg-red-500" : "bg-blue-500"
          }`}
          disabled={isSaving || isUploadedFile}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={32}
            color="white"
          />
        </TouchableOpacity>

        {/* OR Divider */}
        {!isUploadedFile && (
          <AppText className="text-sm text-gray-400">or</AppText>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          onPress={onPickAudio}
          className={`h-20 w-20 items-center justify-center rounded-full ${
            isUploadedFile ? "bg-green-500" : "bg-gray-200"
          }`}
          disabled={isSaving || isRecording || isPicking}
        >
          {isPicking ? (
            <ActivityIndicator size="small" color="#6B7280" />
          ) : (
            <Ionicons
              name={isUploadedFile ? "checkmark" : "cloud-upload-outline"}
              size={32}
              color={isUploadedFile ? "white" : "#6B7280"}
            />
          )}
        </TouchableOpacity>
      </View>

      <AppText className="mt-4 text-sm text-gray-500">
        {getStatusText()}
      </AppText>
    </View>
  );
}
