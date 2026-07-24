import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGetNoteById } from "@/hooks/smart-notes/use-get-note-by-id";
import { useGetFolders } from "@/hooks/smart-notes/use-get-folders";
import { useGetTags } from "@/hooks/smart-notes/use-get-tags";
import { showToast } from "@/utils/show-toast";
import { useSaveNote } from "@/hooks/smart-notes/use-save-notes";
import { RichTextEditor } from "@/components/smart-notes/rich-text-editor";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteEditor() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const noteId = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Fetch note if editing
  const { note, isFetchingNote } = useGetNoteById({
    noteId: noteId || "",
    shouldFetch: !!noteId,
  });

  // Fetch folders and tags for selection
  const { folders } = useGetFolders();
  const { tags: allTags } = useGetTags();

  const { saveNote, isSaving } = useSaveNote({
    noteId: noteId,
  });

  // Load note data when editing
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setSelectedFolderId(note.folderId || null);
      if (note.tags) {
        console.log(note.tags, "note tags here");
        setSelectedTags(note.tags.map((tagItem) => tagItem.tag.name));
      }
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

  const handleAddTag = function (tagName: string) {
    const trimmed = tagName.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  const handleRemoveTag = function (tagName: string) {
    setSelectedTags(selectedTags.filter((t) => t !== tagName));
  };

  const handleTagInputChange = function (text: string) {
    setTagInput(text);
    setShowTagSuggestions(text.length > 0);
  };

  const handleTagSubmit = function () {
    handleAddTag(tagInput);
  };

  const handleBack = function () {
    router.back();
  };

  const handleToggleFolderPicker = function () {
    setShowFolderPicker(!showFolderPicker);
  };

  const handleSelectFolder = function (folderId: string | null) {
    setSelectedFolderId(folderId);
    setShowFolderPicker(false);
  };

  const handleContentChange = function (html: string) {
    setContent(html);
  };

  // Get filtered tag suggestions
  const tagSuggestions = allTags
    .filter(
      (tag: any) =>
        tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
        !selectedTags.includes(tag.name),
    )
    .slice(0, 5);

  // Loading state
  if (isFetchingNote) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={handleBack} className="p-1">
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">
          {noteId ? "Edit Note" : "New Note"}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          className="p-1"
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Text className="font-semibold text-blue-500">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Title */}
        <TextInput
          className="text-2xl font-bold text-gray-900"
          placeholder="Note title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9CA3AF"
          editable={!isSaving}
        />

        <View className="my-4 h-px bg-gray-200" />

        {/* Rich Text Editor */}
        <View className="min-h-[200px]">
          <RichTextEditor
            onChange={handleContentChange}
            content={content || "<p></p>"}
          />
        </View>

        <View className="my-4 h-px bg-gray-200" />

        {/* Folder Picker */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-gray-700">Folder</Text>
          <TouchableOpacity
            onPress={handleToggleFolderPicker}
            className="flex-row items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            disabled={isSaving}
          >
            <Text className="text-gray-900">
              {selectedFolderId
                ? folders.find((f: any) => f.id === selectedFolderId)?.name ||
                  "Select folder"
                : "Select folder"}
            </Text>
            <Ionicons
              name={showFolderPicker ? "chevron-up" : "chevron-down"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {showFolderPicker && (
            <View className="mt-2 overflow-hidden rounded-xl bg-gray-50">
              <TouchableOpacity
                onPress={() => handleSelectFolder(null)}
                className="border-b border-gray-200 px-4 py-3"
              >
                <Text className="text-gray-900">No folder</Text>
              </TouchableOpacity>
              {folders.map((folder: any) => (
                <TouchableOpacity
                  key={folder.id}
                  onPress={() => handleSelectFolder(folder.id)}
                  className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3"
                >
                  <View className="flex-row items-center gap-2">
                    <View
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: folder.color || "#6B7280" }}
                    />
                    <Text className="text-gray-900">{folder.name}</Text>
                  </View>
                  {selectedFolderId === folder.id && (
                    <Ionicons name="checkmark" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Tags */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-gray-700">Tags</Text>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <View className="mb-2 flex-row flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <View
                  key={tag}
                  className="flex-row items-center rounded-full bg-blue-100 px-3 py-1"
                >
                  <Text className="text-sm text-blue-700">#{tag}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveTag(tag)}
                    className="ml-1"
                    disabled={isSaving}
                  >
                    <Ionicons name="close" size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Tag Input */}
          <View className="relative">
            <View className="flex-row items-center rounded-xl bg-gray-50 px-4 py-2">
              <Text className="mr-2 text-gray-400">#</Text>
              <TextInput
                className="flex-1 text-gray-900"
                placeholder="Add tag..."
                value={tagInput}
                onChangeText={handleTagInputChange}
                onSubmitEditing={handleTagSubmit}
                placeholderTextColor="#9CA3AF"
                editable={!isSaving}
              />
              {tagInput.length > 0 && (
                <TouchableOpacity onPress={handleTagSubmit}>
                  <Ionicons name="add-circle" size={24} color="#3B82F6" />
                </TouchableOpacity>
              )}
            </View>

            {/* Tag Suggestions */}
            {showTagSuggestions && tagSuggestions.length > 0 && (
              <View className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-100 bg-white shadow-lg">
                {tagSuggestions.map((tag: any) => (
                  <TouchableOpacity
                    key={tag.id}
                    onPress={() => handleAddTag(tag.name)}
                    className="border-b border-gray-50 px-4 py-2"
                  >
                    <Text className="text-gray-900">#{tag.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* AI Actions (Coming Soon) */}
        {content && content !== "<p></p>" && (
          <View className="mt-4 rounded-xl bg-gray-50 p-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              AI Actions
            </Text>
            <TouchableOpacity
              className="flex-row items-center gap-2 opacity-50"
              disabled
            >
              <Ionicons name="sparkles" size={20} color="#6B7280" />
              <Text className="text-gray-500">
                Summarize with AI (Coming Soon)
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
