import { Dispatch, SetStateAction } from "react";
import { AppModal } from "../shared/app-modal";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../shared/app-text";
import { COLORS } from "@/app/(dashboard)/(tabs)/workspaces/smart-notes/folders";

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
  return (
    <AppModal
      isVisible={isModalVisible}
      onClose={closeModal}
      variant="bottom-sheet"
      title={editingFolder ? "Edit Folder" : "New Folder"}
      showHandle
    >
      <View className="mt-2">
        {/* Folder Name */}
        <TextInput
          className="mb-4 rounded-xl bg-gray-50 px-4 py-3 text-base text-gray-900"
          placeholder="Folder name..."
          value={folderName}
          onChangeText={setFolderName}
          placeholderTextColor="#9CA3AF"
          editable={!isSaving}
        />

        {/* Color Picker */}
        <AppText className="mb-2 text-sm font-medium text-gray-700">
          Color
        </AppText>
        <View className="mb-6 flex-row flex-wrap gap-3">
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: color }}
              disabled={isSaving}
            >
              {selectedColor === color && (
                <Ionicons name="checkmark" size={20} color="white" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={closeModal}
            className="flex-1 rounded-lg bg-gray-100 py-3"
            disabled={isSaving}
          >
            <AppText className="text-center font-semibold text-gray-700">
              Cancel
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="flex-1 rounded-lg bg-blue-500 py-3"
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <AppText className="text-center font-semibold text-white">
                {editingFolder ? "Update" : "Create"}
              </AppText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </AppModal>
  );
};
