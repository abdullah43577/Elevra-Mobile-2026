import { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";
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

  // NOTE: deleteTag/isDeleting were previously set up here with a hardcoded
  // empty tagId and never used. If TagItem needs delete functionality,
  // it likely needs its own useDeleteTag call per row (with the real id),
  // not one shared instance at the screen level. Left uninstantiated here
  // until that's confirmed.

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
      <View className="flex-row items-center justify-between border-b border-neutral-100 px-4 py-3">
        <TouchableOpacity onPress={handleBack} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#7D7D8A" />
        </TouchableOpacity>
        <AppText type="label" className="text-[16px]">
          Tags
        </AppText>
        <TouchableOpacity onPress={handleOpenModal} className="p-1">
          <Ionicons name="add" size={24} color="#5B47E8" />
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
            className="mb-4 rounded-2xl bg-neutral-50 px-4 py-3 font-roboto text-base text-primary-500"
            placeholder="Tag name..."
            value={tagName}
            onChangeText={setTagName}
            placeholderTextColor="#B4B4BF"
            editable={!isCreating}
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleCloseModal}
              className="flex-1 items-center rounded-2xl bg-neutral-100 py-3"
              disabled={isCreating}
            >
              <AppText type="body" className="font-semibold text-neutral-600">
                Cancel
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreate}
              className="flex-1 items-center rounded-2xl bg-secondary-500 py-3"
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <AppText type="body" className="font-semibold text-white">
                  Create
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>
    </SafeAreaView>
  );
}
