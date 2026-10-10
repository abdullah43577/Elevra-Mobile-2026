import { AppText } from "@/components/shared/app-text";
import { WorkspaceItem } from "@/constants/workspaces";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface Props {
  item: WorkspaceItem;
  onPress: (item: WorkspaceItem) => void;
}

export const WorkspaceCard = function ({ item, onPress }: Props) {
  const Icon = item.icon;
  const { foregroundSubtle } = useThemeColors();

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-row items-center gap-4 rounded-2xl border-hairline border-line bg-surface p-4 active:opacity-70"
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 42, height: 42, backgroundColor: `${item.color}14` }}
      >
        <Icon size={20} color={item.color} />
      </View>

      <View className="flex-1">
        <AppText type="label" className="text-[15px]">
          {item.title}
        </AppText>

        <AppText type="caption" className="mt-1" numberOfLines={1}>
          {item.description}
        </AppText>
      </View>

      <ChevronRight size={17} color={foregroundSubtle} />
    </Pressable>
  );
};
