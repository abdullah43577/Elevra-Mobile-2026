import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { ScreenHeader } from "@/components/shared/screen-header";
import { FolderItem } from "@/components/smart-notes/folder-item";
import { SaveFolder } from "@/components/smart-notes/save-folder";
import { COLORS } from "@/constants/colors";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { useGetFolders } from "@/hooks/smart-notes/use-get-folders";
import { useSaveFolder } from "@/hooks/smart-notes/use-save-folder";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

    saveFolder({ name: folderName.trim(), color: selectedColor });
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

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader
        title="Folders"
        onBack={() => router.back()}
        right={
          <IconButton
            icon="add"
            onPress={openCreateModal}
            size={24}
            color={CONTENT_COLORS.note}
          />
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 py-5"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingFolders}
            onRefresh={refetchFolders}
            tintColor={CONTENT_COLORS.note}
          />
        }
      >
        {folders.length === 0 ? (
          <EmptyState
            icon="folder-outline"
            title="No folders"
            subtitle="Create folders to keep your notes organized"
            buttonText="Create folder"
            onButtonPress={openCreateModal}
          />
        ) : (
          <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
            {folders.map((folder, index) => (
              <FolderItem
                key={folder.id}
                item={folder}
                openEditModal={openEditModal}
                withDivider={index > 0}
              />
            ))}
          </View>
        )}
      </ScrollView>

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
