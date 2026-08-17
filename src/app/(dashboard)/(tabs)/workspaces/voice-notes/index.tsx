import { AppText } from "@/components/shared/app-text";
import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { SearchBar } from "@/components/shared/search-bar";
import { RecordingCard } from "@/components/voice-notes/recording-card";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetRecordings } from "@/hooks/voice-notes/use-get-recordings";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VoiceNotes() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 1000);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { recordings, isFetchingRecordings, refetchRecordings } =
    useGetRecordings({ search: debouncedSearch || undefined });

  const handleCreateRecording = function () {
    router.push("/(dashboard)/(tabs)/workspaces/voice-notes/recorder");
  };

  const handleOpenRecording = function (recordingId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/voice-notes/playback",
      params: { id: recordingId },
    });
  };

  const handleToggleSearch = function () {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) setSearchQuery("");
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="flex-row items-start justify-between px-5 pb-4 pt-2">
        <View className="flex-1 pr-3">
          <AppText type="display">Voice Notes</AppText>
          <AppText type="subtitle" className="mt-1">
            {recordings.length}{" "}
            {recordings.length === 1 ? "recording" : "recordings"}
          </AppText>
        </View>

        <IconButton
          icon={isSearchVisible ? "close-outline" : "search-outline"}
          onPress={handleToggleSearch}
        />
      </View>

      {isSearchVisible && (
        <View className="px-5 pb-3">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search recordings..."
            autoFocus
          />
        </View>
      )}

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordingCard
            recording={item}
            onPress={() => handleOpenRecording(item.id)}
            onPlayback={() => handleOpenRecording(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingRecordings}
            onRefresh={refetchRecordings}
            tintColor={CONTENT_COLORS.recording}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="mic-outline"
            title={searchQuery ? "No recordings found" : "No recordings yet"}
            subtitle={
              searchQuery
                ? "Try a different search term"
                : "Record or upload your first voice note"
            }
            accentColor={CONTENT_COLORS.recording}
            {...(!searchQuery && {
              buttonText: "Start recording",
              onButtonPress: handleCreateRecording,
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

      <Pressable
        onPress={handleCreateRecording}
        className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full active:opacity-80"
        style={{
          backgroundColor: CONTENT_COLORS.recording,
          shadowColor: CONTENT_COLORS.recording,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Ionicons name="mic" size={24} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
