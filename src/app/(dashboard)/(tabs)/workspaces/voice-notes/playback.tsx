import { AppText } from "@/components/shared/app-text";
import { ScreenHeader } from "@/components/shared/screen-header";
import { PlaybackControls } from "@/components/voice-notes/playback/playback-controls";
import { PlaybackInfo } from "@/components/voice-notes/playback/playback-info";
import { PlaybackTranscription } from "@/components/voice-notes/playback/playback-transcription";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { useGetRecordingById } from "@/hooks/voice-notes/use-get-recording-by-id";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Playback() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const recordingId = params.id;

  const { recording, isFetchingRecording } = useGetRecordingById({
    recordingId: recordingId || "",
    shouldFetch: !!recordingId,
  });

  const player = useAudioPlayer(recording?.fileUrl ?? null);
  // Reading player.currentTime/duration during render does not re-render — the
  // native object mutates without notifying React.
  const status = useAudioPlayerStatus(player);

  // status.duration stays 0 until the remote file loads.
  const duration =
    status.duration > 0 ? status.duration : (recording?.duration ?? 0);
  const currentTime = duration
    ? Math.min(status.currentTime, duration)
    : status.currentTime;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFinished =
    status.didJustFinish || (duration > 0 && currentTime >= duration - 0.25);

  const handlePlayPause = async function () {
    if (status.playing) {
      player.pause();
      return;
    }

    // A player parked at the end ignores play(), so rewind before replaying.
    if (isFinished) await player.seekTo(0);
    player.play();
  };

  const handleSeekBackward = async function () {
    await player.seekTo(Math.max(currentTime - 10, 0));
  };

  const handleSeekForward = async function () {
    if (!duration) return;
    await player.seekTo(Math.min(currentTime + 10, duration));
  };

  const handleBack = function () {
    if (status.playing) player.pause();
    router.back();
  };

  // First load only — a spinner on background refetches would tear down the
  // player mid-playback.
  if (isFetchingRecording && !recording) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator size="large" color={CONTENT_COLORS.recording} />
      </View>
    );
  }

  if (!recording) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <AppText type="subtitle">Recording not found</AppText>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader title="Playback" onBack={handleBack} />

      <View className="flex-1 px-5 pt-8">
        <PlaybackInfo
          title={recording.title}
          duration={recording.duration}
          createdAt={recording.createdAt}
        />

        <PlaybackTranscription
          isTranscribed={recording.isTranscribed}
          transcription={recording.transcription}
        />

        <PlaybackControls
          isPlaying={status.playing}
          isFinished={isFinished}
          isLoading={!status.isLoaded}
          progress={progress}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          onSeekBackward={handleSeekBackward}
          onSeekForward={handleSeekForward}
        />
      </View>
    </SafeAreaView>
  );
}
