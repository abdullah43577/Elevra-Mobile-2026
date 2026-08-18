import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";

interface Props {
  filledCount: number;
  totalCount: number;
  accent: string;
  tint: string;
}

export const ProfileCompleteness = function ({
  filledCount,
  totalCount,
  accent,
  tint,
}: Props) {
  const percent = Math.round((filledCount / totalCount) * 100);

  return (
    <View className="rounded-3xl border-hairline border-line bg-surface p-5">
      <View className="flex-row items-end justify-between">
        <View className="flex-1 pr-3">
          <AppText type="label">Profile completeness</AppText>
          <AppText type="caption" className="mt-1">
            {filledCount} of {totalCount} sections filled in
          </AppText>
        </View>

        <AppText
          type="display"
          className="text-[26px] leading-[30px]"
          style={{ color: accent }}
        >
          {percent}%
        </AppText>
      </View>

      <View
        className="mt-4 h-1.5 overflow-hidden rounded-full"
        style={{ backgroundColor: tint }}
      >
        <View
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: accent }}
        />
      </View>
    </View>
  );
};
