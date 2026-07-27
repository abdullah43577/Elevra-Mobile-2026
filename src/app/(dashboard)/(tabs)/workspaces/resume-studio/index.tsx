import { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/shared/app-text";
import { useGetTemplates } from "@/hooks/resume/use-get-templates";
import { TemplateCard } from "@/components/resume-studio/template-card";

const CATEGORIES = ["All", "professional", "creative", "minimal", "executive"];

export default function ResumeStudio() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { templates, isFetchingTemplates } = useGetTemplates({
    category: selectedCategory === "All" ? undefined : selectedCategory,
    search: searchQuery || undefined,
  });

  const handleSelectTemplate = function (templateId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/resume-studio/template-detail",
      params: { id: templateId },
    });
  };

  if (isFetchingTemplates && templates.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pb-2 pt-4">
        <AppText className="text-2xl font-bold text-gray-900">
          Choose a Template
        </AppText>
        <AppText className="text-sm text-gray-500">
          Select a template to start building your resume
        </AppText>
      </View>

      {/* Search */}
      <View className="px-4 pb-2">
        <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-2">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            className="ml-2 flex-1 text-base text-gray-900"
            placeholder="Search templates..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <View className="px-4 py-2">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              className={`mr-2 rounded-full px-4 py-1.5 ${
                selectedCategory === item ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <AppText
                className={`text-sm capitalize ${
                  selectedCategory === item ? "text-white" : "text-gray-700"
                }`}
              >
                {item}
              </AppText>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Templates Grid */}
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TemplateCard item={item} onSelectTemplate={handleSelectTemplate} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-12">
            <AppText className="text-gray-500">No templates found</AppText>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
