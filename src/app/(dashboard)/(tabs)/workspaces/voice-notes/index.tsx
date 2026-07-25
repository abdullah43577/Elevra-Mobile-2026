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
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetRecordings } from "@/hooks/voice-notes/use-get-recordings";
import { useDeleteRecording } from "@/hooks/voice-notes/use-delete-recording";
import { RecordingCard } from "@/components/voice-notes/recording-card";
import { EmptyState } from "@/components/smart-notes/empty-state";

export default function VoiceNotes() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { recordings, isFetchingRecordings, refetchRecordings } =
    useGetRecordings({
      search: searchQuery || undefined,
    });

  const handleRefresh = function () {
    refetchRecordings();
  };

  const handleCreateRecording = function () {
    router.push("/(dashboard)/(tabs)/workspaces/voice-notes/recorder");
  };

  const handleRecordingPress = function (recordingId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/voice-notes/playback",
      params: { id: recordingId },
    });
  };

  const handlePlayback = function (recordingId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/voice-notes/playback",
      params: { id: recordingId },
    });
  };

  const handleToggleSearch = function () {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleClearSearch = function () {
    setSearchQuery("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
        <Text className="text-2xl font-bold text-gray-900">Voice Notes</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={handleToggleSearch} className="p-2">
            <Ionicons
              name={isSearchVisible ? "close-outline" : "search-outline"}
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreateRecording} className="p-2">
            <Ionicons name="mic-outline" size={24} color="#3B82F6" />
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
              placeholder="Search recordings..."
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

      {/* Recordings List */}
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingRecordings}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        renderItem={({ item }) => {
          const { deleteRecording, isDeleting } = useDeleteRecording({
            recordingId: item.id,
          });

          return (
            <RecordingCard
              recording={item}
              onPress={() => handleRecordingPress(item.id)}
              onPlayback={() => handlePlayback(item.id)}
              onDelete={() => deleteRecording()}
              isDeleting={isDeleting}
            />
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="mic-outline"
            title="No recordings yet"
            subtitle="Tap the mic button to start recording your first voice note"
            buttonText="Start Recording"
            onButtonPress={handleCreateRecording}
          />
        )}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
      />
    </SafeAreaView>
  );
}
