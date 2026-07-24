import { useDeleteNote } from "@/hooks/smart-notes/use-delete-note";
import { useToggleArchive } from "@/hooks/smart-notes/use-toggle-archive";
import { useTogglePin } from "@/hooks/smart-notes/use-toggle-pin";
import { Note } from "../../../types/notes";
import { NoteCard } from "./note-card";
import { router } from "expo-router";

export const NoteItem = function ({ item }: { item: Note }) {
  // Each note gets its own hook instance with its specific noteId
  const { deleteNote, isDeleting } = useDeleteNote({
    noteId: item.id,
  });

  const { toggleArchive, isTogglingArchive } = useToggleArchive({
    noteId: item.id,
  });

  const { togglePin, isTogglingPin } = useTogglePin({
    noteId: item.id,
  });

  const handleNotePress = function (noteId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/smart-notes/note-editor",
      params: { id: noteId },
    });
  };

  return (
    <NoteCard
      note={item}
      onPress={() => handleNotePress(item.id)}
      onDelete={() => deleteNote()}
      onArchive={() => toggleArchive()}
      onPin={() => togglePin()}
      isDeleting={isDeleting}
      isTogglingArchive={isTogglingArchive}
      isTogglingPin={isTogglingPin}
    />
  );
};
