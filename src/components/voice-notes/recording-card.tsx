import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { VoiceRecording } from "../../../types/voice-notes";
import { AppText } from "../shared/app-text";

interface RecordingCardProps {
  recording: VoiceRecording;
  onPress: () => void;
  onDelete: () => void;
  onPlayback: () => void;
  isDeleting?: boolean;
}

export function RecordingCard({
  recording,
  onPress,
  onDelete,
  onPlayback,
  isDeleting = false,
}: RecordingCardProps) {
  const formatDuration = function (seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 my-1.5 rounded-xl border border-gray-100 bg-gray-50 p-4"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="mic-outline" size={20} color="#3B82F6" />
            <AppText className="flex-1 text-base font-semibold text-gray-900">
              {recording.title}
            </AppText>
          </View>

          <View className="mt-2 flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <AppText className="text-xs text-gray-500">
                {formatDuration(recording.duration)}
              </AppText>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <AppText className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(recording.createdAt), {
                  addSuffix: true,
                })}
              </AppText>
            </View>
            {recording.isTranscribed && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <AppText className="text-xs text-green-600">
                  Transcribed
                </AppText>
              </View>
            )}
          </View>
        </View>

        <View className="flex-row gap-1">
          <TouchableOpacity onPress={onPlayback} className="p-1">
            <Ionicons name="play-circle-outline" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            className="p-1"
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}
