import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";

interface PlaybackHeaderProps {
  onBack: () => void;
}

export function PlaybackHeader({ onBack }: PlaybackHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
      <TouchableOpacity onPress={onBack} className="p-1">
        <Ionicons name="arrow-back" size={24} color="#6B7280" />
      </TouchableOpacity>
      <AppText className="text-lg font-semibold text-gray-900">
        Playback
      </AppText>
      <View className="w-10" />
    </View>
  );
}
