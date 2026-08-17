import { useThemeColors } from "@/hooks/use-theme-colors";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

interface Props {
  isPinned: boolean;
  isArchived: boolean;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isTogglingPin?: boolean;
  isTogglingArchive?: boolean;
  isDeleting?: boolean;
}

export const NoteCardActions = function ({
  isPinned,
  isArchived,
  onPin,
  onArchive,
  onDelete,
  isTogglingPin = false,
  isTogglingArchive = false,
  isDeleting = false,
}: Props) {
  const { foregroundMuted, foregroundSubtle } = useThemeColors();

  return (
    <View className="flex-row items-center gap-1">
      <Pressable
        onPress={onPin}
        disabled={isTogglingPin}
        hitSlop={4}
        className="h-8 w-8 items-center justify-center rounded-full active:bg-surface-muted"
      >
        {isTogglingPin ? (
          <ActivityIndicator size="small" color={CONTENT_COLORS.note} />
        ) : (
          <Ionicons
            name={isPinned ? "bookmark" : "bookmark-outline"}
            size={16}
            color={isPinned ? CONTENT_COLORS.note : "#B4B4BF"}
          />
        )}
      </Pressable>

      <Pressable
        onPress={onArchive}
        disabled={isTogglingArchive}
        hitSlop={4}
        className="h-8 w-8 items-center justify-center rounded-full active:bg-surface-muted"
      >
        {isTogglingArchive ? (
          <ActivityIndicator size="small" color={foregroundMuted} />
        ) : (
          <Ionicons
            name={isArchived ? "archive" : "archive-outline"}
            size={16}
            color={isArchived ? "#47474F" : "#B4B4BF"}
          />
        )}
      </Pressable>

      <Pressable
        onPress={onDelete}
        disabled={isDeleting}
        hitSlop={4}
        className="h-8 w-8 items-center justify-center rounded-full active:bg-danger-muted"
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#B93A32" />
        ) : (
          <Ionicons name="trash-outline" size={16} color={foregroundSubtle} />
        )}
      </Pressable>
    </View>
  );
};
