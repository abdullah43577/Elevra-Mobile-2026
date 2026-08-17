import { AppText } from "@/components/shared/app-text";
import { CONTENT_META } from "@/constants/content-colors";
import { formatRelativeDate, RecentItem } from "@/constants/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface Props {
  item: RecentItem;
  onPress: (item: RecentItem) => void;
}

export const RecentActivityRow = function ({ item, onPress }: Props) {
  const meta = CONTENT_META[item.type];

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-row items-center gap-3 px-4 py-3.5 active:bg-surface-muted"
    >
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 36, height: 36, backgroundColor: `${meta.color}14` }}
      >
        <Ionicons name={meta.icon} size={17} color={meta.color} />
      </View>

      <View className="flex-1">
        <AppText
          type="body"
          className="font-bricolage-medium"
          numberOfLines={1}
        >
          {item.title}
        </AppText>
        <View className="mt-0.5 flex-row items-center gap-1.5">
          <AppText type="caption">{item.type}</AppText>
          <View className="h-0.5 w-0.5 rounded-full bg-line-strong" />
          <AppText type="caption">{formatRelativeDate(item.date)}</AppText>
        </View>
      </View>

      <ChevronRight size={16} color="#D5D5DE" />
    </Pressable>
  );
};
