import { AppText } from "@/components/shared/app-text";
import { CONTENT_META, ContentCategory } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

interface Props {
  counts: Partial<Record<ContentCategory, number>>;
}

/*
  A wrapping grid rather than a single row. Four content types fitted across one
  row; six do not — the captions wrap and the tiles fall out of alignment. Three
  per row keeps every caption on one line whatever the count.
*/
export const StatsOverview = function ({ counts }: Props) {
  const CATEGORIES = (Object.keys(CONTENT_META) as ContentCategory[]).filter(
    (key) => counts[key] !== undefined,
  );

  return (
    <View className="flex-row flex-wrap rounded-3xl border-hairline border-line bg-surface px-2 py-3">
      {CATEGORIES.map((key) => {
        const meta = CONTENT_META[key];

        return (
          // Width in `style`, not a utility class: this is a child of a
          // wrapping row, and a percentage basis is what makes three fit.
          <View key={key} className="items-center py-3" style={{ width: "33.333%" }}>
            <View
              className="mb-2.5 items-center justify-center rounded-full"
              style={{
                width: 34,
                height: 34,
                backgroundColor: `${meta.color}14`,
              }}
            >
              <Ionicons name={meta.icon} size={16} color={meta.color} />
            </View>

            <AppText type="display" className="text-[24px] leading-[28px]">
              {counts[key]}
            </AppText>
            <AppText type="caption" className="mt-0.5" numberOfLines={1}>
              {meta.plural}
            </AppText>
          </View>
        );
      })}
    </View>
  );
};
