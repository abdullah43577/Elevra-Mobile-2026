import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface NoteEditorHeaderProps {
  noteId?: string;
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
}

export function NoteEditorHeader({
  noteId,
  isSaving,
  onBack,
  onSave,
}: NoteEditorHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
      <TouchableOpacity onPress={onBack} className="p-1">
        <Ionicons name="close" size={24} color="#6B7280" />
      </TouchableOpacity>
      <Text className="font-bricolage-semibold text-lg text-gray-900">
        {noteId ? "Edit Note" : "New Note"}
      </Text>
      <TouchableOpacity onPress={onSave} className="p-1" disabled={isSaving}>
        {isSaving ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <Text className="font-bricolage-semibold text-blue-500">Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
