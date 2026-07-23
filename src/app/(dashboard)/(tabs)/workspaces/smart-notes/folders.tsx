import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGetFolders } from "@/hooks/smart-notes/use-get-folders";
import { useSaveFolder } from "@/hooks/smart-notes/use-save-folder";
import { useDeleteFolder } from "@/hooks/smart-notes/use-delete-folder";
import { EmptyState } from "@/components/smart-notes/empty-state";
import { SaveFolder } from "@/components/smart-notes/save-folder";
import { showToast } from "@/utils/show-toast";

export const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
];

export default function Folders() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFolder, setEditingFolder] = useState<any>(null);
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const { folders, isFetchingFolders, refetchFolders } = useGetFolders();

  // Save folder hook - passes folderId only when editing
  const { saveFolder, isSaving } = useSaveFolder({
    folderId: editingFolder?.id,
  });

  const handleSave = function () {
    if (!folderName.trim()) {
      showToast("error", "Please enter a folder name");
      return;
    }

    saveFolder({
      name: folderName.trim(),
      color: selectedColor,
    });
  };

  const openCreateModal = function () {
    setEditingFolder(null);
    setFolderName("");
    setSelectedColor(COLORS[0]);
    setIsModalVisible(true);
  };

  const openEditModal = function (folder: any) {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setSelectedColor(folder.color || COLORS[0]);
    setIsModalVisible(true);
  };

  const closeModal = function () {
    setIsModalVisible(false);
    setEditingFolder(null);
    setFolderName("");
  };

  const handleBack = function () {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={handleBack} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Folders</Text>
        <TouchableOpacity onPress={openCreateModal} className="p-1">
          <Ionicons name="add" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Folders List */}
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        refreshing={isFetchingFolders}
        onRefresh={refetchFolders}
        renderItem={({ item }) => {
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
                <Text className="text-base text-gray-900">{item.name}</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="text-sm text-gray-400">
                  {item._count?.notes || 0} notes
                </Text>
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
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="folder-outline"
            title="No folders"
            subtitle="Create folders to organize your notes"
            buttonText="Create Folder"
            onButtonPress={openCreateModal}
          />
        )}
      />

      {/* Create/Edit Modal */}
      <SaveFolder
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        editingFolder={editingFolder}
        folderName={folderName}
        setFolderName={setFolderName}
        isSaving={isSaving}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        handleSave={handleSave}
      />
    </View>
  );
}
