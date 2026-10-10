import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";
import { KeywordCoverage } from "../../../../types/job-application";

interface Props {
  coverage: KeywordCoverage;
  accentColor: string;
  previousScore?: number;
}

export const KeywordMatchMeter = function ({ coverage, accentColor, previousScore }: Props) {
  return (
    <View>
      <View className="flex-row items-baseline gap-2">
        {previousScore !== undefined && previousScore !== coverage.score && (
          <AppText type="subtitle" className="text-foreground-subtle line-through">
            {previousScore}%
          </AppText>
        )}
        <AppText type="display" style={{ color: accentColor }}>
          {coverage.score}%
        </AppText>
        <AppText type="caption">
          of {coverage.total} keywords from the posting
        </AppText>
      </View>

      <View className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <View
          className="h-full rounded-full"
          style={{ width: `${coverage.score}%`, backgroundColor: accentColor }}
        />
      </View>
    </View>
  );
};
