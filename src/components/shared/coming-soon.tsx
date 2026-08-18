import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export function ComingSoon({
  icon = "sparkles-outline",
  title = "Coming Soon",
  description = "We're putting the finishing touches on this feature.",
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  description?: string;
}) {
  const { foregroundMuted } = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center bg-canvas px-8">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
        <Ionicons name={icon} size={28} color={foregroundMuted} />
      </View>
      <AppText type="title" className="text-center">
        {title}
      </AppText>
      <AppText
        type="subtitle"
        className="mt-2 text-center text-foreground-muted"
      >
        {description}
      </AppText>
    </View>
  );
}
