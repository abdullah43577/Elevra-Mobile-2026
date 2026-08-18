import { AppText } from "@/components/shared/app-text";
import {
  CONTENT_META,
  CONTENT_TYPE_BY_CATEGORY,
} from "@/constants/content-colors";
import { SEARCH_FILTERS } from "@/constants/search";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { clsx } from "clsx";
import { Pressable, ScrollView, View } from "react-native";
import { SearchResultType } from "../../../types/search";

interface Props {
  selectedType: SearchResultType | null;
  counts?: Record<SearchResultType, number>;
  onSelectType: (type: SearchResultType | null) => void;
}

const chipClass = function (isSelected: boolean) {
  return clsx(
    "flex-row items-center gap-1.5 rounded-full border-hairline px-3.5 py-1.5 active:opacity-70",
    isSelected ? "border-transparent" : "border-line bg-surface",
  );
};

export const SearchTypeFilters = function ({
  selectedType,
  counts,
  onSelectType,
}: Props) {
  const { contentColor, foreground } = useThemeColors();

  /*
    A type with nothing to show is hidden rather than disabled. Six always-on
    chips push the interesting ones off-screen on a phone, and a chip reading
    "Letters 0" is a dead end the user has to read before dismissing.
  */
  const visible = SEARCH_FILTERS.filter(
    (type) => !counts || counts[type] > 0 || selectedType === type,
  );

  if (visible.length < 2) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-5"
    >
      <Pressable
        onPress={() => onSelectType(null)}
        className={chipClass(!selectedType)}
        style={!selectedType ? { backgroundColor: foreground } : undefined}
      >
        <AppText
          type="caption"
          className={
            !selectedType
              ? "font-bricolage-semibold text-canvas"
              : "text-foreground-muted"
          }
        >
          All
        </AppText>
      </Pressable>

      {visible.map((type) => {
        const isSelected = selectedType === type;
        const color = contentColor(CONTENT_TYPE_BY_CATEGORY[type]);
        const count = counts?.[type];

        return (
          <Pressable
            key={type}
            onPress={() => onSelectType(isSelected ? null : type)}
            className={chipClass(isSelected)}
            style={isSelected ? { backgroundColor: color } : undefined}
          >
            {!isSelected && (
              <View
                className="rounded-full"
                style={{ width: 6, height: 6, backgroundColor: color }}
              />
            )}

            <AppText
              type="caption"
              className={
                isSelected
                  ? "font-bricolage-semibold text-foreground-inverse"
                  : "text-foreground-muted"
              }
            >
              {CONTENT_META[type].plural}
              {count ? ` ${count}` : ""}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
