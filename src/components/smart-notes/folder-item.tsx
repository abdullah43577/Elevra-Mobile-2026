import { useDeleteFolder } from "@/hooks/smart-notes/use-delete-folder";
import { Folder } from "../../../types/notes";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { AppText } from "../shared/app-text";
import { Ionicons } from "@expo/vector-icons";

export const FolderItem = function ({
  item,
  openEditModal,
}: {
  item: Folder;
  openEditModal: (item: Folder) => void;
}) {
  // Each folder gets its own delete hook
  const { deleteFolder, isDeleting } = useDeleteFolder({
    folderId: item.id,
  });

  return (
    <TouchableOpacity
      onPress={() => openEditModal(item)}
      className="flex-row items-center justify-between border-b border-gray-50 px-4 py-3"
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: item.color || "#6B7280" }}
        />
        <AppText className="text-base text-gray-900">{item.name}</AppText>
      </View>
      <View className="flex-row items-center gap-3">
        <AppText className="text-sm text-gray-400">
          {item._count?.notes || 0} notes
        </AppText>
        <TouchableOpacity
          onPress={() => deleteFolder(null)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
