import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

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

  const handleSubmit = function () {
    handleAddTag(tagInput);
  };

  const handleSelectSuggestion = function (tagName: string) {
    handleAddTag(tagName);
  };

  // Get filtered tag suggestions
  const suggestions = allTags
    .filter(
      (tag: any) =>
        tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
        !selectedTags.includes(tag.name),
    )
    .slice(0, 5);

  return (
    <View className="mb-4">
      <Text className="font-bricolage-medium mb-2 text-sm text-gray-700">
        Tags
      </Text>

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
                onPress={() => onRemoveTag(tag)}
                className="ml-1"
                disabled={disabled}
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
            onChangeText={handleInputChange}
            onSubmitEditing={handleSubmit}
            placeholderTextColor="#9CA3AF"
            editable={!disabled}
          />
          {tagInput.length > 0 && (
            <TouchableOpacity onPress={handleSubmit}>
              <Ionicons name="add-circle" size={24} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tag Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-100 bg-white shadow-lg">
            {suggestions.map((tag: any) => (
              <TouchableOpacity
                key={tag.id}
                onPress={() => handleSelectSuggestion(tag.name)}
                className="border-b border-gray-50 px-4 py-2"
              >
                <Text className="text-gray-900">#{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
