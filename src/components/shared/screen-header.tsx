import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { AppText } from "./app-text";

interface Props {
  title: string;
  onBack?: () => void;
  backIcon?: keyof typeof Ionicons.glyphMap;
  right?: ReactNode;
}

export const ScreenHeader = function ({
  title,
  onBack,
  backIcon = "arrow-back",
  right,
}: Props) {
  const { foreground } = useThemeColors();

  return (
    <View className="flex-row items-center gap-2 border-b-hairline border-line bg-surface px-4 py-2.5">
      <View className="w-16 flex-row items-center">
        {onBack && (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center rounded-full active:bg-surface-muted"
          >
            <Ionicons name={backIcon} size={22} color={foreground} />
          </Pressable>
        )}
      </View>

      <AppText type="label" className="flex-1 text-center text-[16px]">
        {title}
      </AppText>

      <View className="w-16 flex-row items-center justify-end">{right}</View>
    </View>
  );
};
