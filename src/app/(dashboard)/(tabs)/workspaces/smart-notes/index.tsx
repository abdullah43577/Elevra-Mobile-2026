import { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";
import { useGetNotes } from "@/hooks/smart-notes/use-get-notes";
import { useGetFolders } from "@/hooks/smart-notes/use-get-folders";
import { SkeletonCard } from "@/components/smart-notes/skeleton-card";
import { FilterChips } from "@/components/smart-notes/filter-chips";
import { EmptyState } from "@/components/smart-notes/empty-state";
import { NoteItem } from "@/components/smart-notes/note-item";
import { useDebounce } from "@/hooks/use-debounce";

export default function SmartNotes() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 1000);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { notes, isFetchingNotes, refetchNotes } = useGetNotes({
    folderId: selectedFolder || undefined,
    search: debouncedSearch || undefined,
  });

  const { folders, isFetchingFolders } = useGetFolders();

  const handleRefresh = function () {
    refetchNotes();
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

  if (isFetchingNotes && notes.length === 0) {
    return (
      <View className="flex-1 bg-white px-4 pt-4">
        <View className="mb-4 flex-row items-center justify-between">
          <AppText type="title">Smart Notes</AppText>
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
        <AppText type="title">Smart Notes</AppText>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={handleToggleSearch} className="p-2">
            <Ionicons
              name={isSearchVisible ? "close-outline" : "search-outline"}
              size={24}
              color="#7D7D8A"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToFolders} className="p-2">
            <Ionicons name="folder-outline" size={24} color="#7D7D8A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToTags} className="p-2">
            <Ionicons name="pricetag-outline" size={24} color="#7D7D8A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToFilter} className="p-2">
            <Ionicons name="filter-outline" size={24} color="#7D7D8A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {isSearchVisible && (
        <View className="px-4 pb-3">
          <View className="flex-row items-center rounded-2xl bg-neutral-100 px-4 py-2">
            <Ionicons name="search-outline" size={20} color="#B4B4BF" />
            <TextInput
              className="ml-2 flex-1 font-roboto text-base text-primary-500"
              placeholder="Search notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              placeholderTextColor="#B4B4BF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color="#B4B4BF" />
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
            tintColor="#5B47E8"
          />
        }
        renderItem={({ item }) => <NoteItem item={item} />}
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
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-secondary-500"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
