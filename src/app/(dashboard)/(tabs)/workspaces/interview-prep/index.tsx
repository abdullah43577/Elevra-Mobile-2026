import { AiQuestionsCard } from "@/components/interview-prep/ai-questions-card";
import { CategoryChips } from "@/components/interview-prep/category-chips";
import { PracticeSetup } from "@/components/interview-prep/practice-setup";
import { QuestionList } from "@/components/interview-prep/question-list";
import { ReadinessSummary } from "@/components/interview-prep/readiness-summary";
import { AppText } from "@/components/shared/app-text";
import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { SearchBar } from "@/components/shared/search-bar";
import { SectionHeader } from "@/components/shared/section-header";
import { useGetPrepStats } from "@/hooks/interview-prep/use-get-prep-stats";
import { useGetQuestions } from "@/hooks/interview-prep/use-get-questions";
import { useDebounce } from "@/hooks/use-debounce";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { byFocus } from "@/utils/interview-prep";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  InterviewCategory,
  InterviewQuestion,
} from "../../../../../../types/interview-prep";

export default function InterviewPrep() {
  const router = useRouter();
  const { contentTint } = useThemeColors();
  const { color: accent, surface: tint } = contentTint("interview");

  const [category, setCategory] = useState<InterviewCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSetupVisible, setIsSetupVisible] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { questions, isFetchingQuestions, refetchQuestions } = useGetQuestions({
    ...(category && { category }),
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const { prepStats, refetchPrepStats } = useGetPrepStats();

  // Least ready first, so the list opens on what actually needs work rather
  // than on whatever happens to be first in the catalogue.
  const ordered = useMemo(() => [...questions].sort(byFocus), [questions]);

  const handleOpenQuestion = function (question: InterviewQuestion) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/interview-prep/question-detail",
      params: { questionId: question.id },
    });
  };

  const handleStartPractice = function (options: {
    size: number | null;
    category: InterviewCategory | null;
  }) {
    setIsSetupVisible(false);
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/interview-prep/practice",
      params: {
        ...(options.size && { size: String(options.size) }),
        ...(options.category && { category: options.category }),
      },
    });
  };

  const handleRefresh = function () {
    refetchQuestions();
    refetchPrepStats();
  };

  const isFirstLoad = isFetchingQuestions && questions.length === 0;
  const isFiltering = !!debouncedSearch || !!category;

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="flex-row items-start justify-between px-5 pb-4 pt-2">
        <View className="flex-1 pr-3">
          <AppText type="display">Interview Prep</AppText>
          <AppText type="subtitle" className="mt-1">
            Rehearse out loud, not just on paper
          </AppText>
        </View>

        <IconButton
          icon={isSearchVisible ? "close-outline" : "search-outline"}
          onPress={() => {
            setIsSearchVisible((previous) => !previous);
            if (isSearchVisible) setSearchQuery("");
          }}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 110, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isFetchingQuestions && questions.length > 0}
            onRefresh={handleRefresh}
            tintColor={accent}
          />
        }
      >
        {isSearchVisible && (
          <View className="px-5 pb-3">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder="Search questions..."
              autoFocus
            />
          </View>
        )}

        <View className="px-5">
          <ReadinessSummary stats={prepStats} accent={accent} tint={tint} />
        </View>

        <View className="mt-5">
          <CategoryChips
            selected={category}
            accent={accent}
            onSelect={setCategory}
          />
        </View>

        <View className="mt-6 px-5">
          <AiQuestionsCard />
        </View>

        <View className="mt-8 flex-1 px-5">
          <SectionHeader title="Questions" />

          {isFirstLoad ? (
            <View className="flex-1 items-center justify-center py-16">
              <ActivityIndicator color={accent} />
            </View>
          ) : ordered.length === 0 ? (
            <EmptyState
              icon="chatbubbles-outline"
              accentColor={accent}
              title="No questions found"
              subtitle={
                isFiltering
                  ? "Try a different category or search term"
                  : "The question bank could not be loaded"
              }
            />
          ) : (
            <QuestionList
              questions={ordered}
              onSelectQuestion={handleOpenQuestion}
            />
          )}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => setIsSetupVisible(true)}
        className="absolute bottom-6 left-5 right-5 h-14 flex-row items-center justify-center gap-2 rounded-full active:opacity-80"
        style={{
          backgroundColor: accent,
          shadowColor: accent,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Ionicons name="play" size={18} color="#FFFFFF" />
        <AppText type="label" className="text-white">
          Start practising
        </AppText>
      </Pressable>

      <PracticeSetup
        visible={isSetupVisible}
        accent={accent}
        availableCount={questions.length}
        onClose={() => setIsSetupVisible(false)}
        onStart={handleStartPractice}
      />
    </SafeAreaView>
  );
}
