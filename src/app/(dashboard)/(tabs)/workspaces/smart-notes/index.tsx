import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGetNotes } from "@/hooks/smart-notes/use-get-notes";
import { useGetFolders } from "@/hooks/smart-notes/use-get-folders";
import { useDeleteNote } from "@/hooks/smart-notes/use-delete-note";
import { useToggleArchive } from "@/hooks/smart-notes/use-toggle-archive";
import { useTogglePin } from "@/hooks/smart-notes/use-toggle-pin";
import { SkeletonCard } from "@/components/smart-notes/skeleton-card";
import { FilterChips } from "@/components/smart-notes/filter-chips";
import { NoteCard } from "@/components/smart-notes/note-card";
import { EmptyState } from "@/components/smart-notes/empty-state";

export default function SmartNotes() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Fetch notes with filters
  const { notes, isFetchingNotes, refetchNotes } = useGetNotes({
    folderId: selectedFolder || undefined,
    search: searchQuery || undefined,
  });

  // Fetch folders for filter chips
  const { folders, isFetchingFolders } = useGetFolders();

  const handleRefresh = function () {
    refetchNotes();
  };

  const handleNotePress = function (noteId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/smart-notes/note-editor",
      params: { id: noteId },
    });
  };

  const handleCreateNote = function () {
    router.push("/(dashboard)/(tabs)/workspaces/smart-notes/note-editor");
  };

  const handleClearFilter = function () {
    setSelectedFolder(null);
    setSearchQuery("");
  };

  const handleToggleSearch = function () {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleNavigateToFolders = function () {
    router.push("/(dashboard)/(tabs)/workspaces/smart-notes/folders");
  };

  const handleNavigateToTags = function () {
    router.push("/(dashboard)/(tabs)/workspaces/smart-notes/tags");
  };

  const handleNavigateToFilter = function () {
    router.push("/(dashboard)/(tabs)/workspaces/smart-notes/filter");
  };

  const handleClearSearch = function () {
    setSearchQuery("");
  };

  // Loading state
  if (isFetchingNotes && notes.length === 0) {
    return (
      <View className="flex-1 bg-white px-4 pt-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Smart Notes</Text>
        </View>
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
        <Text className="text-2xl font-bold text-gray-900">Smart Notes</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={handleToggleSearch} className="p-2">
            <Ionicons
              name={isSearchVisible ? "close-outline" : "search-outline"}
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToFolders} className="p-2">
            <Ionicons name="folder-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToTags} className="p-2">
            <Ionicons name="pricetag-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToFilter} className="p-2">
            <Ionicons name="filter-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {isSearchVisible && (
        <View className="px-4 pb-3">
          <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-2">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="ml-2 flex-1 text-base text-gray-900"
              placeholder="Search notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Filter Chips */}
      {!isFetchingFolders && folders.length > 0 && (
        <FilterChips
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onClearFilter={handleClearFilter}
        />
      )}

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingNotes}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        renderItem={({ item }) => {
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

          return (
            <NoteCard
              note={item}
              onPress={() => handleNotePress(item.id)}
              onDelete={() => deleteNote(null)}
              onArchive={() => toggleArchive(null)}
              onPin={() => togglePin(null)}
              isDeleting={isDeleting}
              isTogglingArchive={isTogglingArchive}
              isTogglingPin={isTogglingPin}
            />
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="document-text-outline"
            title={
              searchQuery || selectedFolder ? "No notes found" : "No notes yet"
            }
            subtitle={
              searchQuery || selectedFolder
                ? "Try adjusting your filters"
                : "Create your first note to get started"
            }
            buttonText={
              searchQuery || selectedFolder ? undefined : "Create Note"
            }
            onButtonPress={
              searchQuery || selectedFolder ? undefined : handleCreateNote
            }
          />
        )}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
      />

      {/* FAB */}
      <TouchableOpacity
        onPress={handleCreateNote}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
