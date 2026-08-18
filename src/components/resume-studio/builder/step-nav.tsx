import { AppText } from "@/components/shared/app-text";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { Pressable, ScrollView, View } from "react-native";

// Structural rather than BuilderStep, so the career profile editor can drive
// the same nav from PROFILE_SECTIONS without inventing builder steps.
export interface StepNavItem {
  id: string;
  short: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Props {
  steps: StepNavItem[];
  activeIndex: number;
  furthestIndex: number;
  accent: string;
  onSelectStep: (index: number) => void;
}

/*
  Tappable rather than linear-only. Steps up to the furthest one reached stay
  navigable so a user can jump back and fix something without pressing Previous
  eight times.
*/
export const StepNav = function ({
  steps,
  activeIndex,
  furthestIndex,
  accent,
  onSelectStep,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-5"
    >
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isReachable = index <= furthestIndex;
        const isComplete = index < furthestIndex;

        return (
          <Pressable
            key={step.id}
            onPress={() => isReachable && onSelectStep(index)}
            disabled={!isReachable}
            className={clsx(
              "flex-row items-center gap-1.5 rounded-full border-hairline px-3 py-1.5",
              isActive ? "border-transparent" : "border-line bg-surface",
              !isReachable && "opacity-40",
              isReachable && "active:opacity-70",
            )}
            style={isActive ? { backgroundColor: accent } : undefined}
          >
            <Ionicons
              name={isComplete && !isActive ? "checkmark-circle" : step.icon}
              size={13}
              color={isActive ? "#FFFFFF" : accent}
            />
            <AppText
              type="caption"
              className={isActive ? "font-bricolage-semibold text-foreground-inverse" : "text-foreground-muted"}
            >
              {step.short}
            </AppText>
          </Pressable>
        );
      })}
      <View className="w-2" />
    </ScrollView>
  );
};
