import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { stripHtml } from "@/provider/utils";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { Pressable, View } from "react-native";
import { Note } from "../../../types/notes";
import { NoteCardActions } from "./note-card-actions";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onPin: () => void;
  isDeleting?: boolean;
  isTogglingArchive?: boolean;
  isTogglingPin?: boolean;
}

export function NoteCard({
  note,
  onPress,
  onDelete,
  onArchive,
  onPin,
  isDeleting = false,
  isTogglingArchive = false,
  isTogglingPin = false,
}: NoteCardProps) {
  const preview = stripHtml(note.content);
  const visibleTags = note.tags?.slice(0, 3) ?? [];
  const hiddenTagCount = (note.tags?.length ?? 0) - visibleTags.length;
  const hasChips = !!note.folder || visibleTags.length > 0;

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl border-hairline border-neutral-200 bg-white p-4 active:opacity-70"
    >
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            {note.isPinned && (
              <Ionicons name="bookmark" size={13} color={CONTENT_COLORS.note} />
            )}
            <AppText
              type="label"
              className="flex-1 text-[15px]"
              numberOfLines={1}
            >
              {note.title}
            </AppText>
          </View>

          {!!preview && (
            <AppText
              type="caption"
              className="mt-1.5 leading-[17px] text-neutral-500"
              numberOfLines={2}
            >
              {preview}
            </AppText>
          )}
        </View>

        <NoteCardActions
          isPinned={note.isPinned}
          isArchived={note.isArchived}
          onPin={onPin}
          onArchive={onArchive}
          onDelete={onDelete}
          isTogglingPin={isTogglingPin}
          isTogglingArchive={isTogglingArchive}
          isDeleting={isDeleting}
        />
      </View>

      {hasChips && (
        <View className="mt-3 flex-row flex-wrap items-center gap-1.5">
          {note.folder && (
            <View
              className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{
                backgroundColor: `${note.folder.color || "#7D7D8A"}14`,
              }}
            >
              <View
                className="rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  backgroundColor: note.folder.color || "#7D7D8A",
                }}
              />
              <AppText type="caption" className="text-neutral-600">
                {note.folder.name}
              </AppText>
            </View>
          )}

          {visibleTags.map((tagItem) => (
            <View
              key={tagItem.id}
              className="rounded-full bg-neutral-100 px-2.5 py-1"
            >
              <AppText type="caption" className="text-neutral-600">
                #{tagItem.tag.name}
              </AppText>
            </View>
          ))}

          {hiddenTagCount > 0 && (
            <AppText type="caption">+{hiddenTagCount}</AppText>
          )}
        </View>
      )}

      <AppText type="caption" className="mt-3">
        Updated{" "}
        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
      </AppText>
    </Pressable>
  );
}
