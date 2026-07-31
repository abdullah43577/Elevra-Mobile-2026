import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { AppText } from "../shared/app-text";

interface SummaryButtonProps {
  onPress: () => void;
  isGenerating: boolean;
  hasContent: boolean;
  isSaved: boolean;
  disabled?: boolean;
}

export function SummaryButton({
  onPress,
  isGenerating,
  hasContent,
  isSaved,
  disabled = false,
}: SummaryButtonProps) {
  const isDisabled = disabled || isGenerating || !hasContent || !isSaved;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-2"
      disabled={isDisabled}
    >
      {isGenerating ? (
        <ActivityIndicator size="small" color="#3B82F6" />
      ) : (
        <Ionicons
          name="sparkles"
          size={20}
          color={isDisabled ? "#9CA3AF" : "#3B82F6"}
        />
      )}
      <AppText className={isDisabled ? "text-gray-400" : "text-blue-500"}>
        {isGenerating ? "Generating summary..." : "Summarize with AI"}
      </AppText>
    </TouchableOpacity>
  );
}
