import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppModal } from "@/components/shared/app-modal";
import { useGetTags } from "@/hooks/smart-notes/use-get-tags";
import { useCreateTag } from "@/hooks/smart-notes/use-create-tag";
import { useDeleteTag } from "@/hooks/smart-notes/use-delete-tag";
import { EmptyState } from "@/components/smart-notes/empty-state";
import { showToast } from "@/utils/show-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { TagItem } from "@/components/smart-notes/tag-item";

export default function Tags() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tagName, setTagName] = useState("");

  const { tags, isFetchingTags, refetchTags } = useGetTags();
  const { createTag, isCreating } = useCreateTag();
  const { deleteTag, isDeleting } = useDeleteTag({ tagId: "" });

  const handleCreate = function () {
    if (!tagName.trim()) {
      showToast("error", "Please enter a tag name");
      return;
    }

    createTag({ name: tagName.trim() });
    setTagName("");
    setIsModalVisible(false);
  };

  const handleBack = function () {
    router.back();
  };

  const handleOpenModal = function () {
    setIsModalVisible(true);
  };

  const handleCloseModal = function () {
    setIsModalVisible(false);
    setTagName("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={handleBack} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Tags</Text>
        <TouchableOpacity onPress={handleOpenModal} className="p-1">
          <Ionicons name="add" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Tags List */}
      <FlatList
        data={tags}
        keyExtractor={(item) => item.id}
        refreshing={isFetchingTags}
        onRefresh={refetchTags}
        renderItem={({ item }) => <TagItem item={item} />}
        ListEmptyComponent={() => (
          <EmptyState
            icon="pricetag-outline"
            title="No tags"
            subtitle="Create tags to categorize your notes"
            buttonText="Create Tag"
            onButtonPress={handleOpenModal}
          />
        )}
      />

      {/* Create Tag Modal */}
      <AppModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        variant="bottom-sheet"
        title="New Tag"
        showHandle
      >
        <View className="mt-2">
          <TextInput
            className="mb-4 rounded-xl bg-gray-50 px-4 py-3 text-base text-gray-900"
            placeholder="Tag name..."
            value={tagName}
            onChangeText={setTagName}
            placeholderTextColor="#9CA3AF"
            editable={!isCreating}
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleCloseModal}
              className="flex-1 rounded-lg bg-gray-100 py-3"
              disabled={isCreating}
            >
              <Text className="text-center font-semibold text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreate}
              className="flex-1 rounded-lg bg-blue-500 py-3"
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-center font-semibold text-white">
                  Create
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>
    </SafeAreaView>
  );
}
