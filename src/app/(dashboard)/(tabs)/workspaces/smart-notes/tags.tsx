import { AppButton } from "@/components/shared/app-button";
import { AppModal } from "@/components/shared/app-modal";
import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { ScreenHeader } from "@/components/shared/screen-header";
import { TagItem } from "@/components/smart-notes/tag-item";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { useCreateTag } from "@/hooks/smart-notes/use-create-tag";
import { useGetTags } from "@/hooks/smart-notes/use-get-tags";
import { showToast } from "@/utils/show-toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tags() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tagName, setTagName] = useState("");

  const { tags, isFetchingTags, refetchTags } = useGetTags();
  const { createTag, isCreating } = useCreateTag();

  const handleCreate = function () {
    if (!tagName.trim()) {
      showToast("error", "Please enter a tag name");
      return;
    }

    createTag({ name: tagName.trim() });
    setTagName("");
    setIsModalVisible(false);
  };

  const handleCloseModal = function () {
    setIsModalVisible(false);
    setTagName("");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScreenHeader
        title="Tags"
        onBack={() => router.back()}
        right={
          <IconButton
            icon="add"
            onPress={() => setIsModalVisible(true)}
            size={24}
            color={CONTENT_COLORS.note}
          />
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 py-5"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingTags}
            onRefresh={refetchTags}
            tintColor={CONTENT_COLORS.note}
          />
        }
      >
        {tags.length === 0 ? (
          <EmptyState
            icon="pricetag-outline"
            title="No tags"
            subtitle="Create tags to categorize your notes"
            buttonText="Create tag"
            onButtonPress={() => setIsModalVisible(true)}
          />
        ) : (
          <View className="overflow-hidden rounded-2xl border-hairline border-neutral-200 bg-white">
            {tags.map((tag, index) => (
              <TagItem key={tag.id} item={tag} withDivider={index > 0} />
            ))}
          </View>
        )}
      </ScrollView>

      <AppModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        variant="bottom-sheet"
        title="New tag"
        showHandle
      >
        <View className="mt-2">
          <TextInput
            className="mb-4 rounded-2xl border-hairline border-neutral-200 bg-neutral-50 px-4 py-3.5 font-bricolage text-base text-primary-500"
            placeholder="Tag name..."
            value={tagName}
            onChangeText={setTagName}
            placeholderTextColor="#B4B4BF"
            editable={!isCreating}
            autoFocus
          />

          <View className="flex-row gap-3">
            <AppButton
              type="secondary"
              onPress={handleCloseModal}
              disabled={isCreating}
              label="Cancel"
              className="flex-1"
            />
            <AppButton
              type="submit"
              onPress={handleCreate}
              isLoading={isCreating}
              label="Create"
              className="flex-1"
            />
          </View>
        </View>
      </AppModal>
    </SafeAreaView>
  );
}
