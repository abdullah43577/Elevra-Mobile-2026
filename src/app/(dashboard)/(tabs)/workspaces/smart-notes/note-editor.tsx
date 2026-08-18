import { AIActions } from "@/components/smart-notes/note-editor/AI-actions";
import { FolderPicker } from "@/components/smart-notes/note-editor/folder-picker";
import { NoteEditorHeader } from "@/components/smart-notes/note-editor/note-editor-header";
import { TagManager } from "@/components/smart-notes/note-editor/tag-manager";
import { RichTextEditor } from "@/components/smart-notes/rich-text-editor";
import { useProAction } from "@/components/shared/pro-gate";
import { PRO_FEATURES } from "@/constants/entitlements";
import { useGenerateSummary } from "@/hooks/smart-notes/use-generate-summary";
import { useGetFolders } from "@/hooks/smart-notes/use-get-folders";
import { useGetNoteById } from "@/hooks/smart-notes/use-get-note-by-id";
import { useGetTags } from "@/hooks/smart-notes/use-get-tags";
import { useSaveNote } from "@/hooks/smart-notes/use-save-notes";
import { showToast } from "@/utils/show-toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteEditor() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const noteId = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [summaryComplete, setSummaryComplete] = useState(false);

  const [isHydrated, setIsHydrated] = useState(!noteId);
  const hydratedNoteId = useRef<string | null>(null);

  const { note, isFetchingNote } = useGetNoteById({
    noteId: noteId || "",
    shouldFetch: !!noteId,
  });

  const { folders } = useGetFolders();
  const { tags: allTags } = useGetTags();

  const { saveNote, isSaving } = useSaveNote({
    noteId: noteId,
  });

  const {
    generateSummary,
    summary,
    isLoading: isGeneratingSummary,
    error: summaryError,
    resetSummary,
  } = useGenerateSummary({
    noteId: noteId || "",
  });

  useEffect(() => {
    // Once per note only — `note` changes identity on every background refetch,
    // and re-running this would discard the user's unsaved edits.
    if (!note || hydratedNoteId.current === note.id) return;

    hydratedNoteId.current = note.id;
    setTitle(note.title);
    setContent(note.content || "");
    setSelectedFolderId(note.folderId || null);
    if (note.tags) {
      setSelectedTags(note.tags.map((tagItem: any) => tagItem.tag.name));
    }
    setSummaryComplete(false);
    setIsHydrated(true);
  }, [note]);

  const handleSave = function () {
    if (!title.trim()) {
      showToast("error", "Please enter a title");
      return;
    }

    saveNote({
      title: title.trim(),
      content: content || undefined,
      folderId: selectedFolderId || undefined,
      tagNames: selectedTags.length > 0 ? selectedTags : undefined,
    });
  };

  const { allowed: canSummarize, copy: summaryCopy } = useProAction(
    PRO_FEATURES.AI_NOTE_SUMMARY,
  );

  const handleGenerateSummary = function () {
    if (!noteId) return showToast("error", "Please save the note first");

    if (!content || content === "<p></p>")
      return showToast("error", "Add some content to summarize first");

    /*
      The server refuses this with a 402 either way — it is the actual boundary,
      and the SSE stream would surface the refusal as a bare error toast. Asking
      first turns that into the paywall, which is the same trade resume export
      makes: someone who has written a note and reached for a summary is at the
      point of highest intent, so refusal is the wrong last word.
    */
    if (!canSummarize) {
      showToast("warning", summaryCopy.blurb);
      router.push("/(dashboard)/paywall");
      return;
    }

    setSummaryComplete(false);
    resetSummary();

    generateSummary(
      () => {
        setSummaryComplete(true);
        showToast("success", "Summary generated successfully");
      },
      (errorMsg: string) => {
        showToast("error", errorMsg || "Failed to generate summary");
      },
    );
  };

  const handleSummaryComplete = function () {
    setSummaryComplete(true);
  };

  const handleBack = function () {
    router.back();
  };

  const handleContentChange = function (html: string) {
    setContent(html);
  };

  const handleAddTag = function (tagName: string) {
    const trimmed = tagName.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
  };

  const handleRemoveTag = function (tagName: string) {
    setSelectedTags(selectedTags.filter((t) => t !== tagName));
  };

  // First load only — a spinner on background refetches would unmount the
  // editor mid-edit.
  if (isFetchingNote && !note) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#5B47E8" />
      </View>
    );
  }

  const hasContent = content && content !== "<p></p>";
  const isSaved = !!noteId;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <NoteEditorHeader
        noteId={noteId}
        isSaving={isSaving}
        onBack={handleBack}
        onSave={handleSave}
      />

      <ScrollView className="flex-1 px-5 pt-5">
        <TextInput
          className="font-bricolage-bold text-[26px] leading-[32px] text-foreground"
          placeholder="Note title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#D5D5DE"
          editable={!isSaving}
          multiline
        />

        <View className="my-5 h-px bg-line" />

        <View className="min-h-[200px]">
          {/* Mounted only once `content` holds the real note body — see
              RichTextEditor's `initialContent`. */}
          {isHydrated ? (
            <RichTextEditor
              key={noteId ?? "new-note"}
              onChange={handleContentChange}
              initialContent={content || "<p></p>"}
              autofocus={!noteId}
            />
          ) : (
            <ActivityIndicator color="#5B47E8" />
          )}
        </View>

        <View className="my-5 h-px bg-line" />

        <FolderPicker
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          disabled={isSaving}
        />

        <TagManager
          selectedTags={selectedTags}
          allTags={allTags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          disabled={isSaving}
        />

        <AIActions
          noteId={noteId}
          content={content}
          summary={summary}
          isGeneratingSummary={isGeneratingSummary}
          summaryComplete={summaryComplete}
          summaryError={summaryError}
          existingSummary={note?.aiSummary}
          existingSummaryGeneratedAt={note?.summaryGeneratedAt}
          hasContent={!!hasContent}
          isSaved={!!isSaved}
          onGenerateSummary={handleGenerateSummary}
          onSummaryComplete={handleSummaryComplete}
          disabled={isSaving}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
