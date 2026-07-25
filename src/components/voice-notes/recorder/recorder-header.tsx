import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";

interface RecorderHeaderProps {
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasFile: boolean;
}

export function RecorderHeader({
  onBack,
  onSave,
  isSaving,
  hasFile,
}: RecorderHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
      <TouchableOpacity onPress={onBack} className="p-1">
        <Ionicons name="close" size={24} color="#6B7280" />
      </TouchableOpacity>

      <AppText className="text-lg font-semibold text-gray-900">
        New Recording
      </AppText>

      <TouchableOpacity
        onPress={onSave}
        className="p-1"
        disabled={isSaving || !hasFile}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <AppText
            className={`font-semibold ${
              hasFile ? "text-blue-500" : "text-gray-400"
            }`}
          >
            Save
          </AppText>
        )}
      </TouchableOpacity>
    </View>
  );
}
