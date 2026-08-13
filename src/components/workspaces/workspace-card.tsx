import { AppText } from "@/components/shared/app-text";
import { WorkspaceItem } from "@/constants/workspaces";
import { ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface Props {
  item: WorkspaceItem;
  onPress: (item: WorkspaceItem) => void;
}

export const WorkspaceCard = function ({ item, onPress }: Props) {
  const Icon = item.icon;

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-row items-center gap-4 rounded-2xl bg-white p-5"
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-neutral-100">
        <Icon size={20} color="#18181b" />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <AppText
            type="default"
            className="font-bricolage-semibold text-neutral-900"
          >
            {item.title}
          </AppText>
          {item.locked && (
            <View className="rounded-full bg-neutral-100 px-2 py-0.5">
              <AppText type="default" className="text-xs text-neutral-400">
                Soon
              </AppText>
            </View>
          )}
        </View>
        <AppText type="default" className="mt-0.5 text-sm text-neutral-500">
          {item.description}
        </AppText>
      </View>

      <ChevronRight size={18} color="#a3a3a3" />
    </Pressable>
  );
};
