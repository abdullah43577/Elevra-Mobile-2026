import { useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";
import { useGetFolders } from "@/hooks/smart-notes/use-get-folders";
import { useSaveFolder } from "@/hooks/smart-notes/use-save-folder";
import { EmptyState } from "@/components/smart-notes/empty-state";
import { SaveFolder } from "@/components/smart-notes/save-folder";
import { showToast } from "@/utils/show-toast";
import { COLORS } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { FolderItem } from "@/components/smart-notes/folder-item";

export default function Folders() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFolder, setEditingFolder] = useState<any>(null);
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const { folders, isFetchingFolders, refetchFolders } = useGetFolders();

  const { saveFolder, isSaving } = useSaveFolder({
    folderId: editingFolder?.id,
  });

  const handleSave = function () {
    if (!folderName.trim())
      return showToast("error", "Please enter a folder name");

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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-neutral-100 px-4 py-3">
        <TouchableOpacity onPress={handleBack} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#7D7D8A" />
        </TouchableOpacity>
        <AppText type="label" className="text-[16px]">
          Folders
        </AppText>
        <TouchableOpacity onPress={openCreateModal} className="p-1">
          <Ionicons name="add" size={24} color="#5B47E8" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        refreshing={isFetchingFolders}
        onRefresh={refetchFolders}
        renderItem={({ item }) => (
          <FolderItem item={item} openEditModal={openEditModal} />
        )}
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
    </SafeAreaView>
  );
}
