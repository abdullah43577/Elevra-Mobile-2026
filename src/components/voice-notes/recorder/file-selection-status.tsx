import { useThemeColors } from "@/hooks/use-theme-colors";
import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface FileSelectionStatusProps {
  fileName: string;
  onClearFile: () => void;
}

export function FileSelectionStatus({
  fileName,
  onClearFile,
}: FileSelectionStatusProps) {
  const { foregroundMuted } = useThemeColors();

  return (
    <View
      className="mb-4 w-full flex-row items-center gap-2.5 rounded-2xl px-4 py-3"
      style={{ backgroundColor: `${CONTENT_COLORS.resume}12` }}
    >
      <Ionicons
        name="checkmark-circle"
        size={18}
        color={CONTENT_COLORS.resume}
      />
      <AppText type="caption" className="flex-1" numberOfLines={1}>
        {fileName}
      </AppText>
      <Pressable onPress={onClearFile} hitSlop={8}>
        <Ionicons name="close" size={16} color={foregroundMuted} />
      </Pressable>
    </View>
  );
}
