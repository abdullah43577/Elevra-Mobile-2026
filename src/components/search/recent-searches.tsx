import { AppText } from "@/components/shared/app-text";
import { SectionHeader } from "@/components/shared/section-header";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface Props {
  searches: string[];
  onSelect: (term: string) => void;
  onClear: () => void;
}

export const RecentSearches = function ({ searches, onSelect, onClear }: Props) {
  const { foregroundSubtle } = useThemeColors();

  if (!searches.length) return null;

  return (
    <View className="mt-6">
      <SectionHeader title="Recent" actionLabel="Clear" onPressAction={onClear} />

      <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
        {searches.map((term, index) => (
          <View key={term}>
            {index > 0 && <View className="ml-12 h-px bg-line" />}

            <Pressable
              onPress={() => onSelect(term)}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-surface-muted"
            >
              <Ionicons name="time-outline" size={18} color={foregroundSubtle} />

              <AppText type="body" className="flex-1" numberOfLines={1}>
                {term}
              </AppText>

              <Ionicons
                name="arrow-up-outline"
                size={15}
                color={foregroundSubtle}
                style={{ transform: [{ rotate: "-45deg" }] }}
              />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};
