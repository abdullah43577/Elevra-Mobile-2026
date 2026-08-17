import { useThemeColors } from "@/hooks/use-theme-colors";
import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { useDeleteTag } from "@/hooks/smart-notes/use-delete-tag";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Tag } from "../../../types/notes";

interface Props {
  item: Tag;
  withDivider?: boolean;
}

export const TagItem = function ({ item, withDivider = false }: Props) {
  const { foregroundSubtle } = useThemeColors();

  const { deleteTag, isDeleting } = useDeleteTag({ tagId: item.id });

  const noteCount = item._count?.notes || 0;

  return (
    <View
      className={`flex-row items-center gap-3 px-4 py-3.5 ${
        withDivider ? "border-t-hairline border-line" : ""
      }`}
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{
          width: 34,
          height: 34,
          backgroundColor: `${CONTENT_COLORS.note}14`,
        }}
      >
        <Ionicons name="pricetag" size={15} color={CONTENT_COLORS.note} />
      </View>

      <View className="flex-1">
        <AppText type="label">#{item.name}</AppText>
        <AppText type="caption" className="mt-0.5">
          {noteCount} {noteCount === 1 ? "note" : "notes"}
        </AppText>
      </View>

      <Pressable
        onPress={() => deleteTag(null)}
        disabled={isDeleting}
        hitSlop={8}
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
