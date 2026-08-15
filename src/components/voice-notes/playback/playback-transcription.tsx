import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

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
      <View className="mb-6 rounded-2xl border-hairline border-neutral-200 bg-white p-4">
        <View className="mb-2 flex-row items-center gap-1.5">
          <Ionicons
            name="document-text-outline"
            size={13}
            color={CONTENT_COLORS.resume}
          />
          <AppText
            type="caption"
            className="font-bricolage-semibold"
            style={{ color: CONTENT_COLORS.resume }}
          >
            Transcription
          </AppText>
        </View>
        <AppText type="default" className="text-[15px] leading-[21px]">
          {transcription}
        </AppText>
      </View>
    );
  }

  return (
    <View className="mb-6 flex-row items-center gap-3 rounded-2xl border-hairline border-neutral-200 bg-white p-4">
      <View
        className="items-center justify-center rounded-full bg-neutral-100"
        style={{ width: 32, height: 32 }}
      >
        <Ionicons name="sparkles-outline" size={15} color="#B4B4BF" />
      </View>
      <View className="flex-1">
        <AppText type="label">Transcription coming soon</AppText>
        <AppText type="caption" className="mt-0.5">
          AI processing will be available in a future update.
        </AppText>
      </View>
    </View>
  );
}
