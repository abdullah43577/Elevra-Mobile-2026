import { AppText } from "@/components/shared/app-text";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { View } from "react-native";

interface PlaybackInfoProps {
  title: string;
  duration: number;
  createdAt: string;
}

export function PlaybackInfo({
  title,
  duration,
  createdAt,
}: PlaybackInfoProps) {
  const formatDuration = function (seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View>
      <AppText className="font-bricolage-bold mb-2 text-2xl text-gray-900">
        {title}
      </AppText>

      <View className="mb-6 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <AppText className="text-sm text-gray-500">
            {formatDuration(duration)}
          </AppText>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <AppText className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </AppText>
        </View>
      </View>
    </View>
  );
}
