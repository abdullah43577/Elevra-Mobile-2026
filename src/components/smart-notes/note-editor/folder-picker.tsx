import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Folder {
  id: string;
  name: string;
  color?: string | null;
}

interface FolderPickerProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  disabled?: boolean;
}

export function FolderPicker({
  folders,
  selectedFolderId,
  onSelectFolder,
  disabled = false,
}: FolderPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleToggle = function () {
    setShowPicker(!showPicker);
  };

  const handleSelect = function (folderId: string | null) {
    onSelectFolder(folderId);
    setShowPicker(false);
  };

  const selectedFolderName = selectedFolderId
    ? folders.find((f: any) => f.id === selectedFolderId)?.name ||
      "Select folder"
    : "Select folder";

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-gray-700">Folder</Text>
      <TouchableOpacity
        onPress={handleToggle}
        className="flex-row items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
        disabled={disabled}
      >
        <Text className="text-gray-900">{selectedFolderName}</Text>
        <Ionicons
          name={showPicker ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {showPicker && (
        <View className="mt-2 overflow-hidden rounded-xl bg-gray-50">
          <TouchableOpacity
            onPress={() => handleSelect(null)}
            className="border-b border-gray-200 px-4 py-3"
          >
            <Text className="text-gray-900">No folder</Text>
          </TouchableOpacity>
          {folders.map((folder: any) => (
            <TouchableOpacity
              key={folder.id}
              onPress={() => handleSelect(folder.id)}
              className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3"
            >
              <View className="flex-row items-center gap-2">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: folder.color || "#6B7280" }}
                />
                <Text className="text-gray-900">{folder.name}</Text>
              </View>
              {selectedFolderId === folder.id && (
                <Ionicons name="checkmark" size={20} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
