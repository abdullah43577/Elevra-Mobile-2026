import { AppText } from "@/components/shared/app-text";
import {
  CONTENT_META,
  CONTENT_TYPE_BY_CATEGORY,
} from "@/constants/content-colors";
import { formatRelativeDate } from "@/constants/dashboard";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { SearchResult } from "../../../types/search";

interface Props {
  result: SearchResult;
  onPress: (result: SearchResult) => void;
}

export const SearchResultRow = function ({ result, onPress }: Props) {
  const { contentTint } = useThemeColors();

  const meta = CONTENT_META[result.type];
  const { color, holder } = contentTint(CONTENT_TYPE_BY_CATEGORY[result.type]);

  return (
    <Pressable
      onPress={() => onPress(result)}
      className="flex-row items-start gap-3 px-4 py-3.5 active:bg-surface-muted"
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 36, height: 36, backgroundColor: holder }}
      >
        <Ionicons name={meta.icon} size={17} color={color} />
      </View>

      <View className="flex-1">
        <AppText type="label" className="text-[15px]" numberOfLines={1}>
          {result.title}
        </AppText>

        {result.snippet && (
          <AppText type="subtitle" className="mt-0.5" numberOfLines={2}>
            {result.snippet}
          </AppText>
        )}

        <View className="mt-1.5 flex-row items-center gap-1.5">
          <AppText type="caption" style={{ color }}>
            {meta.label}
          </AppText>

          {result.subtitle && (
            <>
              <View className="h-0.5 w-0.5 rounded-full bg-line-strong" />
              <AppText type="caption" className="flex-shrink" numberOfLines={1}>
                {result.subtitle}
              </AppText>
            </>
          )}

          <View className="h-0.5 w-0.5 rounded-full bg-line-strong" />
          <AppText type="caption">{formatRelativeDate(result.updatedAt)}</AppText>
        </View>
      </View>
    </Pressable>
  );
};
