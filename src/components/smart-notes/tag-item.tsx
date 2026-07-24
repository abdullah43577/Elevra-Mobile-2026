import { useDeleteTag } from "@/hooks/smart-notes/use-delete-tag";
import { Tag } from "../../../types/notes";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { AppText } from "../shared/app-text";
import { Ionicons } from "@expo/vector-icons";

export const TagItem = function ({ item }: { item: Tag }) {
  const { deleteTag: deleteThisTag, isDeleting: isDeletingThis } = useDeleteTag(
    {
      tagId: item.id,
    },
  );

  return (
    <View className="flex-row items-center justify-between border-b border-gray-50 px-4 py-3">
      <AppText className="text-base text-gray-900">#{item.name}</AppText>
      <View className="flex-row items-center gap-3">
        <AppText className="text-sm text-gray-400">
          {item._count?.notes || 0} notes
        </AppText>
        <TouchableOpacity
          onPress={() => deleteThisTag(null)}
          disabled={isDeletingThis}
        >
          {isDeletingThis ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
