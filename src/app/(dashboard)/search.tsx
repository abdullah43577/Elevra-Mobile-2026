import { RecentSearches } from "@/components/search/recent-searches";
import { SearchResultsList } from "@/components/search/search-results-list";
import { SearchTypeFilters } from "@/components/search/search-type-filters";
import { AppText } from "@/components/shared/app-text";
import { EmptyState } from "@/components/shared/empty-state";
import { ScreenHeader } from "@/components/shared/screen-header";
import { SearchBar } from "@/components/shared/search-bar";
import { contentTarget } from "@/constants/content-routes";
import { MIN_SEARCH_LENGTH } from "@/constants/search";
import { useGlobalSearch } from "@/hooks/search/use-global-search";
import { useLocalSearch } from "@/hooks/search/use-local-search";
import { useRecentSearches } from "@/hooks/search/use-recent-searches";
import { useDebounce } from "@/hooks/use-debounce";
import { useIsOnline } from "@/hooks/use-online-status";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Keyboard, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchResult, SearchResultType } from "../../../types/search";

export default function Search() {
  const router = useRouter();
  const isOnline = useIsOnline();
  const { foreground } = useThemeColors();

  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<SearchResultType | null>(
    null,
  );

  const debouncedQuery = useDebounce(query, 350);
  const { recentSearches, rememberSearch, clearRecentSearches } =
    useRecentSearches();

  const { searchResults, isSearching } = useGlobalSearch({
    query: debouncedQuery,
    shouldFetch: isOnline,
  });

  const { localResults } = useLocalSearch({ query: debouncedQuery });

  /*
    Server when there is a connection, cache when there is not — never a merge of
    the two. Merging means deduping rows that differ in field coverage, and a
    result list that reshuffles as the request lands reads as a bug.
  */
  const activeResults = isOnline ? searchResults : localResults;

  // Counts stay whole while the list narrows, so the chips keep working as a
  // map of what was found rather than collapsing to the one type in view.
  const visibleResults = selectedType
    ? (activeResults?.results.filter((result) => result.type === selectedType) ??
      [])
    : (activeResults?.results ?? []);

  const isTypedEnough = debouncedQuery.trim().length >= MIN_SEARCH_LENGTH;
  const isSettling = query.trim() !== debouncedQuery.trim();
  const isLoading =
    isSettling || (isOnline && isTypedEnough && isSearching && !searchResults);

  const handleOpenResult = function (result: SearchResult) {
    rememberSearch(debouncedQuery);

    const { route, params } = contentTarget(result.type, result.id);
    router.push({ pathname: route as never, params });
  };

  const handleSelectRecent = function (term: string) {
    setQuery(term);
    setSelectedType(null);
    Keyboard.dismiss();
  };

  const renderBody = function () {
    if (!isTypedEnough) {
      if (recentSearches.length) {
        return (
          <View className="flex-1 px-5">
            <RecentSearches
              searches={recentSearches}
              onSelect={handleSelectRecent}
              onClear={clearRecentSearches}
            />
          </View>
        );
      }

      return (
        <EmptyState
          icon="search-outline"
          title="Search everything"
          subtitle="Notes, recordings, resumes, cover letters, applications, and your interview answers — all from one place."
        />
      );
    }

    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={foreground} />
        </View>
      );
    }

    if (!visibleResults.length) {
      return (
        <EmptyState
          icon="search-outline"
          title="No matches"
          subtitle={
            isOnline
              ? `Nothing found for "${debouncedQuery.trim()}". Try a shorter word or a different spelling.`
              : `Nothing found for "${debouncedQuery.trim()}" on this device. Reconnect to search everything.`
          }
        />
      );
    }

    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <SearchResultsList
          results={visibleResults}
          onPressResult={handleOpenResult}
        />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScreenHeader title="Search" onBack={() => router.back()} />

      <View className="px-5 pt-4">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery("")}
          onSubmitEditing={() => rememberSearch(query)}
          placeholder="Search everything..."
          autoFocus
        />
      </View>

      {!isOnline && isTypedEnough && (
        <AppText type="caption" className="mt-2 px-5">
          Offline — searching what is saved on this device.
        </AppText>
      )}

      {isTypedEnough && !isLoading && (
        <View className="mt-4">
          <SearchTypeFilters
            selectedType={selectedType}
            {...(activeResults && { counts: activeResults.counts })}
            onSelectType={setSelectedType}
          />
        </View>
      )}

      {renderBody()}
    </SafeAreaView>
  );
}
