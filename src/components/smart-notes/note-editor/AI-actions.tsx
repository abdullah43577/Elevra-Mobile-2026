import { StreamingText } from "@/components/shared/streaming-text";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

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
  noteId,
  content,
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

  return (
    <View className="mt-4 rounded-xl bg-gray-50 p-4">
      <Text className="font-bricolage-medium mb-2 text-sm text-gray-700">
        AI Actions
      </Text>

      {/* Generate Summary Button */}
      <TouchableOpacity
        onPress={onGenerateSummary}
        className="flex-row items-center gap-2"
        disabled={isDisabled}
      >
        {isGeneratingSummary ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <Ionicons
            name="sparkles"
            size={20}
            color={isDisabled ? "#9CA3AF" : "#3B82F6"}
          />
        )}
        <Text className={isDisabled ? "text-gray-400" : "text-blue-500"}>
          {isGeneratingSummary ? "Generating summary..." : "Summarize with AI"}
        </Text>
      </TouchableOpacity>

      {/* Streaming Summary */}
      {(summary || isGeneratingSummary) && (
        <StreamingText
          text={summary}
          isStreaming={isGeneratingSummary}
          isComplete={summaryComplete}
          label={isGeneratingSummary ? "Generating summary..." : "Summary"}
          labelIcon="sparkles"
          containerClassName="mt-3 rounded-lg bg-blue-50 p-3"
          labelClassName="text-xs font-bricolage-medium text-blue-700"
          textClassName="mt-1 text-sm text-gray-700"
          showCursor={true}
          onStreamComplete={onSummaryComplete}
        />
      )}

      {/* Existing Summary from Database */}
      {existingSummary && !summary && !isGeneratingSummary && (
        <View className="mt-3 rounded-lg bg-blue-50 p-3">
          <Text className="font-bricolage-medium text-xs text-blue-700">
            Summary
          </Text>
          <Text className="mt-1 text-sm text-gray-700">{existingSummary}</Text>
          {existingSummaryGeneratedAt && (
            <Text className="mt-1 text-xs text-gray-400">
              Generated{" "}
              {formatDistanceToNow(new Date(existingSummaryGeneratedAt), {
                addSuffix: true,
              })}
            </Text>
          )}
        </View>
      )}

      {/* Error State */}
      {summaryError && (
        <View className="mt-3 rounded-lg bg-red-50 p-3">
          <Text className="text-sm text-red-600">{summaryError}</Text>
        </View>
      )}
    </View>
  );
}
