import { View } from "react-native";

interface OnboardingDotsProps {
  total: number;
  activeIndex: number;
}

export function OnboardingDots({ total, activeIndex }: OnboardingDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={
            index === activeIndex
              ? "h-2 w-6 rounded-full bg-accent"
              : "h-2 w-2 rounded-full bg-line"
          }
        />
      ))}
    </View>
  );
}
