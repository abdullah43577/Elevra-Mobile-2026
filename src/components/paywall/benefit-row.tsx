import { AppText } from "@/components/shared/app-text";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  accent: string;
}

export const BenefitRow = function ({ icon, title, description, accent }: Props) {
  return (
    <View className="flex-row gap-3">
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 36, height: 36, backgroundColor: `${accent}1F` }}
      >
        <Ionicons name={icon} size={17} color={accent} />
      </View>

      <View className="flex-1">
        <AppText type="label">{title}</AppText>
        <AppText type="subtitle" className="mt-0.5">
          {description}
        </AppText>
      </View>
    </View>
  );
};
