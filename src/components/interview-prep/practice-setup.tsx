import { AppButton } from "@/components/shared/app-button";
import { AppModal } from "@/components/shared/app-modal";
import { AppText } from "@/components/shared/app-text";
import {
  CATEGORY_META,
  INTERVIEW_CATEGORIES,
  PRACTICE_SIZES,
} from "@/constants/interview-prep";
import { clsx } from "clsx";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { InterviewCategory } from "../../../types/interview-prep";

interface Props {
  visible: boolean;
  accent: string;
  availableCount: number;
  onClose: () => void;
  onStart: (options: {
    size: number | null;
    category: InterviewCategory | null;
  }) => void;
}

const Chip = function ({
  label,
  isSelected,
  accent,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  accent: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        "rounded-full border-hairline px-3.5 py-2 active:opacity-70",
        isSelected ? "border-transparent" : "border-line bg-surface",
      )}
      style={isSelected ? { backgroundColor: accent } : undefined}
    >
      <AppText
        type="caption"
        className={
          isSelected
            ? "font-bricolage-semibold text-foreground-inverse"
            : "text-foreground-muted"
        }
      >
        {label}
      </AppText>
    </Pressable>
  );
};

export const PracticeSetup = function ({
  visible,
  accent,
  availableCount,
  onClose,
  onStart,
}: Props) {
  const [size, setSize] = useState<number | null>(5);
  const [category, setCategory] = useState<InterviewCategory | null>(null);

  return (
    <AppModal
      isVisible={visible}
      onClose={onClose}
      variant="bottom-sheet"
      showHandle
      title="Start a practice run"
    >
      <AppText type="caption" className="mb-4">
        Questions you have never touched, and the ones you flagged as needing
        work, come first.
      </AppText>

      <AppText type="subtitle" className="mb-2">
        How many
      </AppText>
      <View className="flex-row flex-wrap gap-2">
        {PRACTICE_SIZES.map((option) => (
          <Chip
            key={option.label}
            label={option.label}
            isSelected={size === option.value}
            accent={accent}
            onPress={() => setSize(option.value)}
          />
        ))}
      </View>

      <AppText type="subtitle" className="mb-2 mt-5">
        Focus
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 pr-5"
      >
        <Chip
          label="Everything"
          isSelected={category === null}
          accent={accent}
          onPress={() => setCategory(null)}
        />
        {INTERVIEW_CATEGORIES.map((option) => (
          <Chip
            key={option}
            label={CATEGORY_META[option].short}
            isSelected={category === option}
            accent={accent}
            onPress={() => setCategory(option)}
          />
        ))}
      </ScrollView>

      <AppButton
        type="submit"
        label="Start"
        onPress={() => onStart({ size, category })}
        disabled={availableCount === 0}
        className="mt-6"
        style={{ backgroundColor: accent }}
      />
    </AppModal>
  );
};
