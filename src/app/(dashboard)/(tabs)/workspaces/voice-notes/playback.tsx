import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAudioPlayer } from "expo-audio";
import { useGetRecordingById } from "@/hooks/voice-notes/use-get-recording-by-id";
import { AppText } from "@/components/shared/app-text";
import { PlaybackHeader } from "@/components/voice-notes/playback/playback-header";
import { PlaybackInfo } from "@/components/voice-notes/playback/playback-info";
import { PlaybackTranscription } from "@/components/voice-notes/playback/playback-transcription";
import { PlaybackControls } from "@/components/voice-notes/playback/playback-controls";

export default function Playback() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const recordingId = params.id;

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const { recording, isFetchingRecording } = useGetRecordingById({
    recordingId: recordingId || "",
    shouldFetch: !!recordingId,
  });

  const player = useAudioPlayer(recording?.fileUrl || "");

  useEffect(() => {
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status: any) => {
        if (typeof status?.playing === "boolean") {
          setIsPlaying(status.playing);
        }
        if (typeof status?.currentTime === "number" && status?.duration) {
          setProgress((status.currentTime / status.duration) * 100);
        }
      },
    );

    return () => subscription?.remove?.();
  }, [player]);

  const handlePlayPause = function () {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    // no manual setIsPlaying — let the listener be the single source of truth
  };

  const handleSeekBackward = function () {
    player.seekTo(Math.max((player.currentTime || 0) - 10, 0));
  };

  const handleSeekForward = function () {
    player.seekTo(
      Math.min((player.currentTime || 0) + 10, player.duration || 0),
    );
  };

  const handleBack = function () {
    if (isPlaying) {
      player.pause();
    }
    router.back();
  };

  if (isFetchingRecording) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!recording) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <AppText className="text-gray-500">Recording not found</AppText>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <PlaybackHeader onBack={handleBack} />

      <View className="flex-1 px-6 pt-8">
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
          isPlaying={isPlaying}
          progress={progress}
          currentTime={player.currentTime || 0}
          duration={player.duration || 0}
          onPlayPause={handlePlayPause}
          onSeekBackward={handleSeekBackward}
          onSeekForward={handleSeekForward}
        />
      </View>
    </SafeAreaView>
  );
}
