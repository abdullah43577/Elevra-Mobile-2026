import { View } from "react-native";
import { AppText } from "@/components/shared/app-text";

interface PlaybackTranscriptionProps {
  isTranscribed: boolean;
  transcription?: string | null;
}

export function PlaybackTranscription({
  isTranscribed,
  transcription,
}: PlaybackTranscriptionProps) {
  if (isTranscribed && transcription) {
    return (
      <View className="mb-6 rounded-xl bg-blue-50 p-4">
        <AppText className="mb-1 text-xs font-medium text-blue-700">
          Transcription
        </AppText>
        <AppText className="text-sm text-gray-700">{transcription}</AppText>
      </View>
    );
  }

  return (
    <View className="mb-6 rounded-xl bg-gray-50 p-4">
      <AppText className="text-sm text-gray-500">
        Transcription coming soon. AI processing will be available after the
        initial setup.
      </AppText>
    </View>
  );
}
