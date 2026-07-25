import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";

interface FileSelectionStatusProps {
  fileName: string;
  onClearFile: () => void;
}

export function FileSelectionStatus({
  fileName,
  onClearFile,
}: FileSelectionStatusProps) {
  return (
    <View className="mb-4 flex-row items-center gap-2 rounded-lg bg-green-50 px-4 py-2">
      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
      <AppText className="flex-1 text-sm text-green-700">{fileName}</AppText>
      <TouchableOpacity onPress={onClearFile}>
        <Ionicons name="close" size={18} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}
