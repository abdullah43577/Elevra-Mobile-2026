import { AppText } from "@/components/shared/app-text";
import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { SearchBar } from "@/components/shared/search-bar";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { TemplateCard } from "@/components/resume-studio/template-card";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetTemplates } from "@/hooks/resume/use-get-templates";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { clsx } from "clsx";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Resumes from "./resumes";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "ATS", value: "ats" },
  { label: "Modern", value: "modern" },
  { label: "Minimal", value: "minimal" },
  { label: "Technical", value: "technical" },
];

export default function ResumeStudio() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("resume");

  const [activeTab, setActiveTab] = useState("templates");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { templates, isFetchingTemplates } = useGetTemplates({
    ...(selectedCategory !== "all" && { category: selectedCategory }),
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const handleSelectTemplate = function (templateId: string) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/resume-studio/template-detail",
      params: { id: templateId },
    });
  };

  const handleToggleSearch = function () {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) setSearchQuery("");
  };

  const isFirstLoad = isFetchingTemplates && templates.length === 0;
  const isFiltering = !!debouncedSearch || selectedCategory !== "all";

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="flex-row items-start justify-between px-5 pb-4 pt-2">
        <View className="flex-1 pr-3">
          <AppText type="display">Resume Studio</AppText>
          <AppText type="subtitle" className="mt-1">
            ATS-friendly templates you can edit and export
          </AppText>
        </View>

        {activeTab === "templates" && (
          <IconButton
            icon={isSearchVisible ? "close-outline" : "search-outline"}
            onPress={handleToggleSearch}
          />
        )}
      </View>

      <View className="px-5">
        <SegmentedControl
          options={[
            { label: "Templates", value: "templates" },
            { label: "My Resumes", value: "resumes" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {activeTab === "resumes" ? (
        <View className="mt-4 flex-1">
          <Resumes />
        </View>
      ) : (
        <>
          {isSearchVisible && (
            <View className="px-5 pt-3">
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onClear={() => setSearchQuery("")}
                placeholder="Search templates..."
                autoFocus
              />
            </View>
          )}

          <View className="pt-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 px-5"
            >
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category.value;

                return (
                  <Pressable
                    key={category.value}
                    onPress={() => setSelectedCategory(category.value)}
                    className={clsx(
                      "rounded-full border-hairline px-3.5 py-1.5 active:opacity-70",
                      isSelected ? "border-transparent" : "border-line bg-surface",
                    )}
                    style={isSelected ? { backgroundColor: accent } : undefined}
                  >
                    <AppText
                      type="caption"
                      className={
                        isSelected
                          ? "font-bricolage-semibold text-foreground-inverse"
                          : "text-foreground-muted"
                      }
                    >
                      {category.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {isFirstLoad ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={accent} />
            </View>
          ) : (
            <FlatList
              data={templates}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <TemplateCard item={item} onSelectTemplate={handleSelectTemplate} />
              )}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 110,
                gap: 20,
                flexGrow: 1,
              }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <EmptyState
                  icon="document-outline"
                  accentColor={accent}
                  title="No templates found"
                  subtitle={
                    isFiltering
                      ? "Try a different category or search term"
                      : "Templates will appear here once they are available"
                  }
                />
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
