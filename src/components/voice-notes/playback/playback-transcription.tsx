import { useThemeColors } from "@/hooks/use-theme-colors";
import { AppText } from "@/components/shared/app-text";
import { Badge } from "@/components/shared/badge";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

interface PlaybackTranscriptionProps {
  isTranscribed: boolean;
  transcription?: string | null;
  isPro: boolean;
  isTranscribing: boolean;
  onTranscribe: () => void;
}

export function PlaybackTranscription({
  isTranscribed,
  transcription,
  isPro,
  isTranscribing,
  onTranscribe,
}: PlaybackTranscriptionProps) {
  const { contentTint } = useThemeColors();
  const tint = contentTint("recording");

  if (isTranscribed && transcription) {
    return (
      <View className="mb-6 rounded-2xl border-hairline border-line bg-surface p-4">
        <View className="mb-2 flex-row items-center gap-1.5">
          <Ionicons name="document-text-outline" size={13} color={tint.color} />
          <AppText type="caption" className="font-bricolage-semibold" style={{ color: tint.color }}>
            Transcription
          </AppText>
        </View>
        {/* Capped: playback sits in a fixed layout, and a long memo would push
            the controls off the screen. */}
        <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator nestedScrollEnabled>
          <AppText type="default" className="text-[15px] leading-[21px]">
            {transcription}
          </AppText>
        </ScrollView>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onTranscribe}
      disabled={isTranscribing}
      className="mb-6 flex-row items-center gap-3 rounded-2xl border-hairline border-line p-4 active:opacity-70"
      style={{ backgroundColor: tint.surface }}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 32, height: 32, backgroundColor: tint.holder }}
      >
        {isTranscribing ? (
          <ActivityIndicator size="small" color={tint.color} />
        ) : (
          <Ionicons name="sparkles-outline" size={15} color={tint.color} />
        )}
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <AppText type="label">{isTranscribing ? "Transcribing…" : "Transcribe this recording"}</AppText>
          {!isPro && <Badge label="Pro" />}
        </View>
        <AppText type="caption" className="mt-0.5">
          Turn it into text you can read and search. You will get a notification when it is ready.
        </AppText>
      </View>
    </Pressable>
  );
}
