import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAudioPlayer } from "expo-audio";
import { useGetRecordingById } from "@/hooks/voice-notes/use-get-recording-by-id";
import { formatDistanceToNow } from "date-fns";
import { AppText } from "@/components/shared/app-text";

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

  // Track playback state
  useEffect(() => {
    if (player) {
      setIsPlaying(player.playing);
    }
  }, [player?.playing]);

  // Update progress
  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        if (player.currentTime !== undefined && player.duration) {
          setProgress((player.currentTime / player.duration) * 100);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [player]);

  const handlePlayPause = function () {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleBack = function () {
    if (isPlaying) {
      player.pause();
    }
    router.back();
  };

  const formatDuration = function (seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={handleBack} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <AppText className="text-lg font-semibold text-gray-900">
          Playback
        </AppText>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-8">
        {/* Title */}
        <AppText className="mb-2 text-2xl font-bold text-gray-900">
          {recording.title}
        </AppText>

        {/* Metadata */}
        <View className="mb-6 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <AppText className="text-sm text-gray-500">
              {formatDuration(recording.duration)}
            </AppText>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <AppText className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(recording.createdAt), {
                addSuffix: true,
              })}
            </AppText>
          </View>
        </View>

        {/* Transcription Status */}
        {recording.isTranscribed && recording.transcription ? (
          <View className="mb-6 rounded-xl bg-blue-50 p-4">
            <AppText className="mb-1 text-xs font-medium text-blue-700">
              Transcription
            </AppText>
            <AppText className="text-sm text-gray-700">
              {recording.transcription}
            </AppText>
          </View>
        ) : (
          <View className="mb-6 rounded-xl bg-gray-50 p-4">
            <AppText className="text-sm text-gray-500">
              Transcription coming soon. AI processing will be available after
              the initial setup.
            </AppText>
          </View>
        )}

        {/* Audio Player */}
        <View className="items-center rounded-xl bg-gray-50 p-6">
          {/* Progress Bar */}
          <View className="relative h-1 w-full rounded-full bg-gray-300">
            <View
              className="absolute h-1 rounded-full bg-blue-500"
              style={{ width: `${progress}%` }}
            />
          </View>

          {/* Time Labels */}
          <View className="mt-2 w-full flex-row justify-between">
            <AppText className="text-xs text-gray-500">
              {formatDuration(player.currentTime || 0)}
            </AppText>
            <AppText className="text-xs text-gray-500">
              {formatDuration(player.duration || 0)}
            </AppText>
          </View>

          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={handlePlayPause}
            className="mt-6 h-20 w-20 items-center justify-center rounded-full bg-blue-500"
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={40}
              color="white"
            />
          </TouchableOpacity>

          {/* Seek Controls */}
          <View className="mt-4 flex-row gap-6">
            <TouchableOpacity
              onPress={() =>
                player.seekTo(Math.max((player.currentTime || 0) - 10, 0))
              }
            >
              <Ionicons name="play-back-outline" size={28} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                player.seekTo(
                  Math.min(
                    (player.currentTime || 0) + 10,
                    player.duration || 0,
                  ),
                )
              }
            >
              <Ionicons name="play-forward-outline" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
