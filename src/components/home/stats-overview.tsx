import { AppText } from "@/components/shared/app-text";
import { CONTENT_META, ContentCategory } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { Fragment } from "react";
import { View } from "react-native";

interface Props {
  counts: Partial<Record<ContentCategory, number>>;
}

export const StatsOverview = function ({ counts }: Props) {
  const CATEGORIES = (Object.keys(CONTENT_META) as ContentCategory[]).filter(
    (key) => counts[key] !== undefined,
  );

  return (
    <View className="flex-row items-stretch rounded-3xl border-hairline border-line bg-surface px-2 py-5">
      {CATEGORIES.map((key, index) => {
        const meta = CONTENT_META[key];

        return (
          <Fragment key={key}>
            {index > 0 && <View className="w-px bg-line" />}

            <View className="flex-1 items-center">
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

              <AppText type="display" className="text-[26px] leading-[30px]">
                {counts[key]}
              </AppText>
              <AppText type="caption" className="mt-0.5">
                {meta.plural}
              </AppText>
            </View>
          </Fragment>
        );
      })}
    </View>
  );
};
