import { AIActions } from "@/components/smart-notes/note-editor/AI-actions";
import { FolderPicker } from "@/components/smart-notes/note-editor/folder-picker";
import { NoteEditorHeader } from "@/components/smart-notes/note-editor/note-editor-header";
import { TagManager } from "@/components/smart-notes/note-editor/tag-manager";
import { RichTextEditor } from "@/components/smart-notes/rich-text-editor";
import { useGenerateSummary } from "@/hooks/smart-notes/use-generate-summary";
import { useGetFolders } from "@/hooks/smart-notes/use-get-folders";
import { useGetNoteById } from "@/hooks/smart-notes/use-get-note-by-id";
import { useGetTags } from "@/hooks/smart-notes/use-get-tags";
import { useSaveNote } from "@/hooks/smart-notes/use-save-notes";
import { showToast } from "@/utils/show-toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setSelectedFolderId(note.folderId || null);
      if (note.tags) {
        setSelectedTags(note.tags.map((tagItem: any) => tagItem.tag.name));
      }
      setSummaryComplete(false);
    }
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

  const handleGenerateSummary = function () {
    if (!noteId) return showToast("error", "Please save the note first");

    if (!content || content === "<p></p>")
      return showToast("error", "Add some content to summarize first");

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

  if (isFetchingNote) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#5B47E8" />
      </View>
    );
  }

  const hasContent = content && content !== "<p></p>";
  const isSaved = !!noteId;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NoteEditorHeader
        noteId={noteId}
        isSaving={isSaving}
        onBack={handleBack}
        onSave={handleSave}
      />

      <ScrollView className="flex-1 px-4 pt-4">
        <TextInput
          className="font-roboto text-2xl font-bold text-primary-500"
          placeholder="Note title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#B4B4BF"
          editable={!isSaving}
        />

        <View className="my-4 h-px bg-neutral-200" />

        <View className="min-h-[200px]">
          <RichTextEditor
            onChange={handleContentChange}
            content={content || "<p></p>"}
          />
        </View>

        <View className="my-4 h-px bg-neutral-200" />

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
