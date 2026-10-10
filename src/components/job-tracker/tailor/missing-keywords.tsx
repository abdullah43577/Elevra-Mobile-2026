import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";
import { JobKeyword } from "../../../../types/job-application";

interface Props {
  keywords: JobKeyword[];
  limit?: number;
}

export const MissingKeywords = function ({ keywords, limit = 8 }: Props) {
  if (!keywords.length) return null;

  const shown = keywords.slice(0, limit);
  const hidden = keywords.length - shown.length;

  return (
    <View className="mt-4">
      <AppText type="label">Not in your resume yet</AppText>

      <View className="mt-2 flex-row flex-wrap gap-1.5">
        {shown.map((keyword) => (
          <View
            key={keyword.term}
            className="rounded-full border-hairline border-line bg-surface-muted px-2.5 py-1"
          >
            <AppText
              type="caption"
              className={keyword.required ? "text-foreground" : undefined}
            >
              {keyword.term}
              {keyword.required ? " · required" : ""}
            </AppText>
          </View>
        ))}
        {hidden > 0 && (
          <View className="px-1 py-1">
            <AppText type="caption">+{hidden} more</AppText>
          </View>
        )}
      </View>

      <AppText type="caption" className="mt-2">
        Add these yourself only where they are true for you.
      </AppText>
    </View>
  );
};
