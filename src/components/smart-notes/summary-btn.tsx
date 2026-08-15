import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable } from "react-native";
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
  const accent = isDisabled ? "#B4B4BF" : CONTENT_COLORS.note;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className="flex-row items-center gap-2 active:opacity-70"
    >
      {isGenerating ? (
        <ActivityIndicator size="small" color={CONTENT_COLORS.note} />
      ) : (
        <Ionicons name="sparkles" size={17} color={accent} />
      )}
      <AppText type="label" style={{ color: accent }}>
        {isGenerating ? "Generating summary..." : "Summarize with AI"}
      </AppText>
    </Pressable>
  );
}
