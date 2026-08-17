import { AppText } from "@/components/shared/app-text";
import { StreamingText } from "@/components/shared/streaming-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { ActivityIndicator, Pressable, View } from "react-native";

interface AIActionsProps {
  noteId?: string;
  content: string;
  summary: string;
  isGeneratingSummary: boolean;
  summaryComplete: boolean;
  summaryError: string | null;
  existingSummary?: string | null;
  existingSummaryGeneratedAt?: string | null;
  hasContent: boolean;
  isSaved: boolean;
  onGenerateSummary: () => void;
  onSummaryComplete: () => void;
  disabled?: boolean;
}

export function AIActions({
  summary,
  isGeneratingSummary,
  summaryComplete,
  summaryError,
  existingSummary,
  existingSummaryGeneratedAt,
  hasContent,
  isSaved,
  onGenerateSummary,
  onSummaryComplete,
  disabled = false,
}: AIActionsProps) {
  const isDisabled = disabled || isGeneratingSummary || !hasContent || !isSaved;
  const accent = isDisabled ? "#B4B4BF" : CONTENT_COLORS.note;

  return (
    <View className="mb-6 mt-2 rounded-2xl border-hairline border-line bg-surface p-4">
      <AppText type="label" className="mb-3">
        AI actions
      </AppText>

      <Pressable
        onPress={onGenerateSummary}
        disabled={isDisabled}
        className="flex-row items-center gap-2 active:opacity-70"
      >
        {isGeneratingSummary ? (
          <ActivityIndicator size="small" color={CONTENT_COLORS.note} />
        ) : (
          <Ionicons name="sparkles" size={17} color={accent} />
        )}
        <AppText type="label" style={{ color: accent }}>
          {isGeneratingSummary ? "Generating summary..." : "Summarize with AI"}
        </AppText>
      </Pressable>

      {(summary || isGeneratingSummary) && (
        <StreamingText
          text={summary}
          isStreaming={isGeneratingSummary}
          isComplete={summaryComplete}
          label={isGeneratingSummary ? "Generating summary..." : "Summary"}
          labelIcon="sparkles"
          containerClassName="mt-3 rounded-xl bg-accent-muted p-3.5"
          labelClassName="text-xs font-bricolage-semibold text-accent"
          textClassName="mt-1.5 text-sm leading-[20px] text-foreground"
          showCursor
          onStreamComplete={onSummaryComplete}
        />
      )}

      {existingSummary && !summary && !isGeneratingSummary && (
        <View className="mt-3 rounded-xl bg-accent-muted p-3.5">
          <AppText
            type="caption"
            className="font-bricolage-semibold text-accent"
          >
            Summary
          </AppText>
          <AppText type="default" className="mt-1.5 text-[15px] leading-[20px]">
            {existingSummary}
          </AppText>
          {existingSummaryGeneratedAt && (
            <AppText type="caption" className="mt-2">
              Generated{" "}
              {formatDistanceToNow(new Date(existingSummaryGeneratedAt), {
                addSuffix: true,
              })}
            </AppText>
          )}
        </View>
      )}

      {summaryError && (
        <View className="mt-3 rounded-xl bg-danger-muted p-3.5">
          <AppText type="caption" className="text-danger">
            {summaryError}
          </AppText>
        </View>
      )}
    </View>
  );
}
