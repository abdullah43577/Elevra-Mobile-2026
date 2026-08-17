import { useThemeColors } from "@/hooks/use-theme-colors";
import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { Fragment, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

interface Tag {
  id: string;
  name: string;
}

interface TagManagerProps {
  selectedTags: string[];
  allTags: Tag[];
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  disabled?: boolean;
}

export function TagManager({
  selectedTags,
  allTags,
  onAddTag,
  onRemoveTag,
  disabled = false,
}: TagManagerProps) {
  const { foregroundSubtle } = useThemeColors();

  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = function (text: string) {
    setTagInput(text);
    setShowSuggestions(text.length > 0);
  };

  const handleAddTag = function (tagName: string) {
    const trimmed = tagName.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      onAddTag(trimmed);
    }
    setTagInput("");
    setShowSuggestions(false);
  };

  const suggestions = allTags
    .filter(
      (tag) =>
        tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
        !selectedTags.includes(tag.name),
    )
    .slice(0, 5);

  return (
    <View className="mb-5">
      <AppText type="label" className="mb-2">
        Tags
      </AppText>

      {selectedTags.length > 0 && (
        <View className="mb-2.5 flex-row flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <View
              key={tag}
              className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ backgroundColor: `${CONTENT_COLORS.note}14` }}
            >
              <AppText
                type="caption"
                style={{ color: CONTENT_COLORS.note }}
                className="font-bricolage-semibold"
              >
                #{tag}
              </AppText>
              <Pressable
                onPress={() => onRemoveTag(tag)}
                disabled={disabled}
                hitSlop={6}
              >
                <Ionicons name="close" size={13} color={CONTENT_COLORS.note} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View className="relative">
        <View className="flex-row items-center gap-1 rounded-2xl border-hairline border-line bg-canvas px-4 py-2.5">
          <AppText type="default" className="text-foreground-subtle">
            #
          </AppText>
          <TextInput
            className="flex-1 font-bricolage text-base text-foreground"
            placeholder="Add tag..."
            value={tagInput}
            onChangeText={handleInputChange}
            onSubmitEditing={() => handleAddTag(tagInput)}
            placeholderTextColor={foregroundSubtle}
            editable={!disabled}
          />
          {tagInput.length > 0 && (
            <Pressable onPress={() => handleAddTag(tagInput)} hitSlop={6}>
              <Ionicons
                name="add-circle"
                size={22}
                color={CONTENT_COLORS.note}
              />
            </Pressable>
          )}
        </View>

        {showSuggestions && suggestions.length > 0 && (
          <View className="absolute left-0 right-0 top-full z-10 mt-1.5 overflow-hidden rounded-2xl border-hairline border-line bg-surface">
            {suggestions.map((tag, index) => (
              <Fragment key={tag.id}>
                {index > 0 && <View className="h-px bg-line" />}
                <Pressable
                  onPress={() => handleAddTag(tag.name)}
                  className="px-4 py-2.5 active:bg-surface-muted"
                >
                  <AppText type="default">#{tag.name}</AppText>
                </Pressable>
              </Fragment>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
