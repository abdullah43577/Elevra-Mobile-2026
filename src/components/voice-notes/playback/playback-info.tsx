import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { formatTime } from "@/provider/utils";
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
  return (
    <View className="mb-7 items-center">
      <View
        className="mb-5 items-center justify-center rounded-full"
        style={{
          width: 72,
          height: 72,
          backgroundColor: `${CONTENT_COLORS.recording}14`,
        }}
      >
        <Ionicons name="mic" size={30} color={CONTENT_COLORS.recording} />
      </View>

      <AppText type="title" className="text-center" numberOfLines={2}>
        {title}
      </AppText>

      <View className="mt-2 flex-row items-center gap-1.5">
        <AppText type="caption">{formatTime(duration)}</AppText>
        <View className="h-0.5 w-0.5 rounded-full bg-neutral-300" />
        <AppText type="caption">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </AppText>
      </View>
    </View>
  );
}
