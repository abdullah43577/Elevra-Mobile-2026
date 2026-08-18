import { AppText } from "@/components/shared/app-text";
import { OnboardingSlide as Slide } from "@/constants/onboarding";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

interface Props {
  slide: Slide;
  width: number;
}

export const OnboardingSlide = function ({ slide, width }: Props) {
  const { contentTint } = useThemeColors();
  const { color, surface, holder } = contentTint(slide.accent);

  return (
    <View style={{ width }} className="flex-1 justify-center px-8">
      {/*
        A column parent, so the tile needs explicit dimensions — React Native
        stretches children to full width otherwise and a 96pt tile becomes a
        colour bar with a centred icon (§5).
      */}
      <View
        className="items-center justify-center rounded-[28px]"
        style={{ width: 96, height: 96, backgroundColor: surface }}
      >
        <View
          className="items-center justify-center rounded-squircle"
          style={{ width: 56, height: 56, backgroundColor: holder }}
        >
          <Ionicons name={slide.icon} size={26} color={color} />
        </View>
      </View>

      <AppText type="display" className="mt-10 text-[30px] leading-[38px]">
        {slide.title}
      </AppText>

      <AppText type="subtitle" className="mt-3 text-[15px] leading-[23px]">
        {slide.subtitle}
      </AppText>
    </View>
  );
};
