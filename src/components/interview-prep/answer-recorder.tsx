import { AppText } from "@/components/shared/app-text";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { formatDuration } from "@/utils/interview-prep";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { ActivityIndicator, Pressable, View } from "react-native";

interface Props {
  audioUrl?: string | null;
  audioDuration?: number | null;
  isUploading: boolean;
  accent: string;
  onSaveTake: (take: { uri: string; duration: number }) => void;
  onDeleteTake: () => void;
}

/*
  Record a take, play it back, replace it. One take per answer — the point is
  your current best version, not an archive of attempts.

  Reading player.currentTime during render gives stale values because the native
  object mutates without telling React; status comes from useAudioPlayerStatus.
  status.duration is 0 until the source loads, hence the fallback to the stored
  duration.
*/
export const AnswerRecorder = function ({
  audioUrl,
  audioDuration,
  isUploading,
  accent,
  onSaveTake,
  onDeleteTake,
}: Props) {
  const { foregroundMuted, danger } = useThemeColors();
  const { isRecording, elapsed, startRecording, stopRecording } =
    useVoiceRecorder();

  const player = useAudioPlayer(audioUrl ?? null);
  const status = useAudioPlayerStatus(player);

  const duration = status.duration || audioDuration || 0;

  const handleToggleRecord = async function () {
    if (isRecording) {
      const take = await stopRecording();
      if (take) onSaveTake(take);
      return;
    }

    await startRecording();
  };

  const handleTogglePlay = async function () {
    if (status.playing) {
      player.pause();
      return;
    }

    // A player parked at the end ignores play() — rewind first.
    if (status.didJustFinish || (duration > 0 && status.currentTime >= duration)) {
      await player.seekTo(0);
    }

    player.play();
  };

  return (
    <View className="rounded-2xl border-hairline border-line bg-surface p-4">
      <View className="flex-row items-center justify-between">
        <AppText type="label">Say it out loud</AppText>
        {isUploading && <ActivityIndicator size="small" color={accent} />}
      </View>

      <AppText type="caption" className="mt-0.5">
        {audioUrl
          ? "Play your take back — you will hear the filler words you cannot feel."
          : "Reading an answer and saying it are different skills. Record one."}
      </AppText>

      <View className="mt-4 flex-row items-center gap-3">
        <Pressable
          onPress={handleToggleRecord}
          disabled={isUploading}
          className="h-12 w-12 items-center justify-center rounded-full active:opacity-80"
          style={{ backgroundColor: isRecording ? danger : accent }}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={20}
            color="#FFFFFF"
          />
        </Pressable>

        {isRecording ? (
          <AppText type="label" style={{ color: danger }}>
            {formatDuration(elapsed)}
          </AppText>
        ) : audioUrl ? (
          <>
            <Pressable
              onPress={handleTogglePlay}
              className="h-10 w-10 items-center justify-center rounded-full border-hairline border-line active:bg-surface-muted"
            >
              <Ionicons
                name={status.playing ? "pause" : "play"}
                size={16}
                color={accent}
              />
            </Pressable>

            <AppText type="caption" className="flex-1">
              {formatDuration(status.currentTime || 0)} / {formatDuration(duration)}
            </AppText>

            <Pressable onPress={onDeleteTake} hitSlop={8} className="p-1">
              <Ionicons name="trash-outline" size={16} color={foregroundMuted} />
            </Pressable>
          </>
        ) : (
          <AppText type="caption" className="flex-1">
            No recording yet
          </AppText>
        )}
      </View>
    </View>
  );
};
