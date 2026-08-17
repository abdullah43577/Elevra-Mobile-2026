import { useThemeColors } from "@/hooks/use-theme-colors";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { Pressable, TextInput, View } from "react-native";
import { AppButton } from "../shared/app-button";
import { AppModal } from "../shared/app-modal";
import { AppText } from "../shared/app-text";

interface Props {
  isModalVisible: boolean;
  closeModal: () => void;
  editingFolder: boolean;
  folderName: string;
  setFolderName: Dispatch<SetStateAction<string>>;
  isSaving: boolean;
  selectedColor: string;
  setSelectedColor: Dispatch<SetStateAction<string>>;
  handleSave: () => void;
}

export const SaveFolder = function ({
  isModalVisible,
  closeModal,
  editingFolder,
  folderName,
  setFolderName,
  isSaving,
  selectedColor,
  setSelectedColor,
  handleSave,
}: Props) {
  const { foregroundSubtle } = useThemeColors();

  return (
    <AppModal
      isVisible={isModalVisible}
      onClose={closeModal}
      variant="bottom-sheet"
      title={editingFolder ? "Edit folder" : "New folder"}
      showHandle
    >
      <View className="mt-2">
        <TextInput
          className="mb-5 rounded-2xl border-hairline border-line bg-canvas px-4 py-3.5 font-bricolage text-base text-foreground"
          placeholder="Folder name..."
          value={folderName}
          onChangeText={setFolderName}
          placeholderTextColor={foregroundSubtle}
          editable={!isSaving}
        />

        <AppText type="label" className="mb-3">
          Color
        </AppText>
        <View className="mb-7 flex-row flex-wrap gap-3">
          {COLORS.map((color) => (
            <Pressable
              key={color}
              onPress={() => setSelectedColor(color)}
              disabled={isSaving}
              className="items-center justify-center rounded-full active:opacity-70"
              style={{ width: 38, height: 38, backgroundColor: color }}
            >
              {selectedColor === color && (
                <Ionicons name="checkmark" size={18} color="white" />
              )}
            </Pressable>
          ))}
        </View>

        <View className="flex-row gap-3">
          <AppButton
            type="secondary"
            onPress={closeModal}
            disabled={isSaving}
            label="Cancel"
            className="flex-1"
          />
          <AppButton
            type="submit"
            onPress={handleSave}
            isLoading={isSaving}
            label={editingFolder ? "Update" : "Create"}
            className="flex-1"
          />
        </View>
      </View>
    </AppModal>
  );
};
