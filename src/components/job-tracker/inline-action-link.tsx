import { AppText } from "@/components/shared/app-text";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable } from "react-native";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
  isLoading?: boolean;
  loadingLabel?: string;
  /** Marks a Pro action for free users, so the paywall is not a surprise. */
  showProTag?: boolean;
}

// A quiet secondary action under a linked-items section on application detail.
export const InlineActionLink = function ({ icon, label, color, onPress, isLoading, loadingLabel, showProTag }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className="mt-2 flex-row items-center gap-1.5 self-start py-1 active:opacity-70"
    >
      {isLoading ? <ActivityIndicator size="small" color={color} /> : <Ionicons name={icon} size={15} color={color} />}
      <AppText type="caption" style={{ color }}>
        {isLoading && loadingLabel ? loadingLabel : label}
        {showProTag && !isLoading ? "  · Pro" : ""}
      </AppText>
    </Pressable>
  );
};
