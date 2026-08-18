import { useThemeColors } from "@/hooks/use-theme-colors";
import { View } from "react-native";

interface Props {
  total: number;
  activeIndex: number;
}

export const SetupProgress = function ({ total, activeIndex }: Props) {
  const { foreground, line } = useThemeColors();

  return (
    <View className="flex-row gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className="h-1 flex-1 rounded-full"
          style={{
            backgroundColor: index <= activeIndex ? foreground : line,
          }}
        />
      ))}
    </View>
  );
};
