import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { AppButton } from "./app-button";
import { AppText } from "./app-text";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonPress?: () => void;
  accentColor?: string;
}

export const EmptyState = function ({
  icon,
  title,
  subtitle,
  buttonText,
  onButtonPress,
  accentColor = CONTENT_COLORS.note,
}: Props) {
  return (
    <View className="flex-1 items-center justify-center px-10 py-16">
      <View
        className="mb-4 items-center justify-center rounded-full"
        style={{ width: 64, height: 64, backgroundColor: `${accentColor}14` }}
      >
        <Ionicons name={icon} size={26} color={accentColor} />
      </View>

      <AppText type="title" className="text-center text-[19px] leading-[24px]">
        {title}
      </AppText>
      <AppText type="subtitle" className="mt-1.5 text-center">
        {subtitle}
      </AppText>

      {buttonText && onButtonPress && (
        <AppButton
          type="submit"
          label={buttonText}
          onPress={onButtonPress}
          className="mt-6 h-12 self-center px-6"
        />
      )}
    </View>
  );
};
