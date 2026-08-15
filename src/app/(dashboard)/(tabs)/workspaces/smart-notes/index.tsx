import { AppText } from "@/components/shared/app-text";
import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterChips } from "@/components/smart-notes/filter-chips";
import { NoteItem } from "@/components/smart-notes/note-item";
import { SkeletonCard } from "@/components/smart-notes/skeleton-card";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetFolders } from "@/hooks/smart-notes/use-get-folders";
import { useGetNotes } from "@/hooks/smart-notes/use-get-notes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handleCreateNote = function () {
    router.push("/(dashboard)/(tabs)/workspaces/smart-notes/note-editor");
  };

  const handleClearFilter = function () {
    setSelectedFolder(null);
    setSearchQuery("");
  };

  const handleToggleSearch = function () {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) setSearchQuery("");
  };

  const isFiltering = !!searchQuery || !!selectedFolder;
  const isFirstLoad = isFetchingNotes && notes.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-row items-start justify-between px-5 pb-4 pt-2">
        <View className="flex-1 pr-3">
          <AppText type="display">Smart Notes</AppText>
          <AppText type="subtitle" className="mt-1">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </AppText>
        </View>

        <View className="flex-row items-center">
          <IconButton
            icon={isSearchVisible ? "close-outline" : "search-outline"}
            onPress={handleToggleSearch}
          />
          <IconButton
            icon="folder-outline"
            onPress={() =>
              router.push("/(dashboard)/(tabs)/workspaces/smart-notes/folders")
            }
          />
          <IconButton
            icon="pricetag-outline"
            onPress={() =>
              router.push("/(dashboard)/(tabs)/workspaces/smart-notes/tags")
            }
          />
          <IconButton
            icon="options-outline"
            onPress={() =>
              router.push("/(dashboard)/(tabs)/workspaces/smart-notes/filter")
            }
          />
        </View>
      </View>

      {isSearchVisible && (
        <View className="px-5 pb-3">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search notes..."
            autoFocus
          />
        </View>
      )}

      {!isFetchingFolders && folders.length > 0 && (
        <View className="pb-4">
          <FilterChips
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
            onClearFilter={handleClearFilter}
          />
        </View>
      )}

      {isFirstLoad ? (
        <View className="px-5">
          {[1, 2, 3].map((key) => (
            <SkeletonCard key={key} />
          ))}
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteItem item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingNotes}
              onRefresh={refetchNotes}
              tintColor={CONTENT_COLORS.note}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title={isFiltering ? "No notes found" : "No notes yet"}
              subtitle={
                isFiltering
                  ? "Try adjusting your search or filters"
                  : "Create your first note to get started"
              }
              {...(!isFiltering && {
                buttonText: "Create note",
                onButtonPress: handleCreateNote,
              })}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 110,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable
        onPress={handleCreateNote}
        className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full active:opacity-80"
        style={{
          backgroundColor: CONTENT_COLORS.note,
          shadowColor: CONTENT_COLORS.note,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={26} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
