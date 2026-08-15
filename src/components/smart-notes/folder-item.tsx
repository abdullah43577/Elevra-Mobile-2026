import { AppText } from "@/components/shared/app-text";
import { useDeleteFolder } from "@/hooks/smart-notes/use-delete-folder";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Folder } from "../../../types/notes";

interface Props {
  item: Folder;
  openEditModal: (item: Folder) => void;
  withDivider?: boolean;
}

export const FolderItem = function ({
  item,
  openEditModal,
  withDivider = false,
}: Props) {
  const { deleteFolder, isDeleting } = useDeleteFolder({ folderId: item.id });

  const noteCount = item._count?.notes || 0;

  return (
    <Pressable
      onPress={() => openEditModal(item)}
      className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-neutral-50 ${
        withDivider ? "border-t-hairline border-neutral-100" : ""
      }`}
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{
          width: 34,
          height: 34,
          backgroundColor: `${item.color || "#7D7D8A"}14`,
        }}
      >
        <Ionicons name="folder" size={16} color={item.color || "#7D7D8A"} />
      </View>

      <View className="flex-1">
        <AppText type="label">{item.name}</AppText>
        <AppText type="caption" className="mt-0.5">
          {noteCount} {noteCount === 1 ? "note" : "notes"}
        </AppText>
      </View>

      <Pressable
        onPress={() => deleteFolder(null)}
        disabled={isDeleting}
        hitSlop={8}
        className="h-8 w-8 items-center justify-center rounded-full active:bg-error-50"
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#B93A32" />
        ) : (
          <Ionicons name="trash-outline" size={16} color="#B4B4BF" />
        )}
      </Pressable>
    </Pressable>
  );
};
