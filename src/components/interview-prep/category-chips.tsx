import { AppText } from "@/components/shared/app-text";
import { CATEGORY_META, INTERVIEW_CATEGORIES } from "@/constants/interview-prep";
import { clsx } from "clsx";
import { Pressable, ScrollView } from "react-native";
import { InterviewCategory } from "../../../types/interview-prep";

interface Props {
  selected: InterviewCategory | null;
  accent: string;
  onSelect: (category: InterviewCategory | null) => void;
}

export const CategoryChips = function ({ selected, accent, onSelect }: Props) {
  const options: { label: string; value: InterviewCategory | null }[] = [
    { label: "All", value: null },
    ...INTERVIEW_CATEGORIES.map((category) => ({
      label: CATEGORY_META[category].short,
      value: category,
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-5"
    >
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <Pressable
            key={option.label}
            onPress={() => onSelect(option.value)}
            className={clsx(
              "rounded-full border-hairline px-3.5 py-1.5 active:opacity-70",
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
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
