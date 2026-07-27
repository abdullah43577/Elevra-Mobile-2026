import { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/shared/app-text";
import { useGetTemplates } from "@/hooks/resume/use-get-templates";
import { TemplateCard } from "@/components/resume-studio/template-card";
import Resumes from "./resumes";

const CATEGORIES = ["All", "professional", "creative", "minimal", "executive"];

export default function ResumeStudio() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"templates" | "resumes">(
    "templates",
  );
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with Tab Switcher */}
      <View className="px-4 pb-2 pt-4">
        <AppText className="text-2xl font-bold text-gray-900">
          Resume Studio
        </AppText>
        <AppText className="text-sm text-gray-500">
          Create and manage your resumes
        </AppText>

        {/* Tab Switcher */}
        <View className="mt-4 flex-row rounded-lg bg-gray-100 p-1">
          <TouchableOpacity
            onPress={() => setActiveTab("templates")}
            className={`flex-1 rounded-lg py-2 ${
              activeTab === "templates" ? "bg-white" : ""
            }`}
            style={
              activeTab === "templates"
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 2,
                  }
                : undefined
            }
          >
            <AppText
              className={`text-center font-medium ${
                activeTab === "templates" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              Templates
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("resumes")}
            className={`flex-1 rounded-lg py-2 ${
              activeTab === "resumes" ? "bg-white" : ""
            }`}
            style={
              activeTab === "resumes"
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 2,
                  }
                : undefined
            }
          >
            <AppText
              className={`text-center font-medium ${
                activeTab === "resumes" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              My Resumes
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "resumes" ? (
        <Resumes />
      ) : (
        <>
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
          {isFetchingTemplates && templates.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          ) : (
            <FlatList
              data={templates}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={({ item }) => (
                <TemplateCard
                  item={item}
                  onSelectTemplate={handleSelectTemplate}
                />
              )}
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingBottom: 100,
              }}
              ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center py-12">
                  <AppText className="text-gray-500">
                    No templates found
                  </AppText>
                </View>
              )}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
