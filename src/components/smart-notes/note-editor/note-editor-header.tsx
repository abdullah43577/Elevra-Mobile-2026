import { AppText } from "@/components/shared/app-text";
import { ScreenHeader } from "@/components/shared/screen-header";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { ActivityIndicator, Pressable } from "react-native";

interface NoteEditorHeaderProps {
  noteId?: string;
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
}

export function NoteEditorHeader({
  noteId,
  isSaving,
  onBack,
  onSave,
}: NoteEditorHeaderProps) {
  return (
    <ScreenHeader
      title={noteId ? "Edit note" : "New note"}
      onBack={onBack}
      backIcon="close"
      right={
        isSaving ? (
          <ActivityIndicator size="small" color={CONTENT_COLORS.note} />
        ) : (
          <Pressable onPress={onSave} hitSlop={8}>
            <AppText type="link">Save</AppText>
          </Pressable>
        )
      }
    />
  );
}
