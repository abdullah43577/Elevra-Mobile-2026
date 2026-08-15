import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { useDeleteRecording } from "@/hooks/voice-notes/use-delete-recording";
import { formatTime } from "@/provider/utils";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { ActivityIndicator, Pressable, View } from "react-native";
import { VoiceRecording } from "../../../types/voice-notes";

interface RecordingCardProps {
  recording: VoiceRecording;
  onPress: () => void;
  onPlayback: () => void;
}

export function RecordingCard({
  recording,
  onPress,
  onPlayback,
}: RecordingCardProps) {
  const { deleteRecording, isDeleting } = useDeleteRecording({
    recordingId: recording.id,
  });

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center gap-3 rounded-2xl border-hairline border-neutral-200 bg-white p-4 active:opacity-70"
    >
      <Pressable
        onPress={onPlayback}
        hitSlop={6}
        className="items-center justify-center rounded-full active:opacity-70"
        style={{
          width: 44,
          height: 44,
          backgroundColor: `${CONTENT_COLORS.recording}14`,
        }}
      >
        <Ionicons name="play" size={18} color={CONTENT_COLORS.recording} />
      </Pressable>

      <View className="flex-1">
        <AppText type="label" className="text-[15px]" numberOfLines={1}>
          {recording.title}
        </AppText>

        <View className="mt-1 flex-row items-center gap-1.5">
          <AppText type="caption">{formatTime(recording.duration)}</AppText>
          <View className="h-0.5 w-0.5 rounded-full bg-neutral-300" />
          <AppText type="caption" numberOfLines={1}>
            {formatDistanceToNow(new Date(recording.createdAt), {
              addSuffix: true,
            })}
          </AppText>
        </View>

        {recording.isTranscribed && (
          <View className="mt-2 flex-row items-center gap-1 self-start rounded-full bg-content-resume/10 px-2 py-0.5">
            <Ionicons
              name="checkmark-circle"
              size={11}
              color={CONTENT_COLORS.resume}
            />
            <AppText
              type="caption"
              style={{ color: CONTENT_COLORS.resume }}
              className="font-bricolage-semibold"
            >
              Transcribed
            </AppText>
          </View>
        )}
      </View>

      <Pressable
        onPress={() => deleteRecording()}
        disabled={isDeleting}
        hitSlop={8}
        className="h-8 w-8 items-center justify-center rounded-full active:bg-error-50"
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#B93A32" />
        ) : (
          <Ionicons name="trash-outline" size={16} color="#B4B4BF" />
        )}
      </Pressable>
    </Pressable>
  );
}
