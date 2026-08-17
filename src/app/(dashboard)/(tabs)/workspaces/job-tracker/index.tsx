import { ApplicationList } from "@/components/job-tracker/application-list";
import { PipelineSummary } from "@/components/job-tracker/pipeline-summary";
import { StatusFilterChips } from "@/components/job-tracker/status-filter-chips";
import { AppText } from "@/components/shared/app-text";
import { EmptyState } from "@/components/shared/empty-state";
import { IconButton } from "@/components/shared/icon-button";
import { SearchBar } from "@/components/shared/search-bar";
import { useGetApplications } from "@/hooks/job-applications/use-get-applications";
import { useGetApplicationStats } from "@/hooks/job-applications/use-get-application-stats";
import { useDebounce } from "@/hooks/use-debounce";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationStatus, JobApplication } from "../../../../../../types/job-application";

export default function JobTracker() {
  const router = useRouter();
  const { contentColor } = useThemeColors();
  const accent = contentColor("application");

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { applications, isFetchingApplications, refetchApplications } =
    useGetApplications({
      ...(selectedStatus && { status: selectedStatus }),
      ...(debouncedSearch && { search: debouncedSearch }),
    });

  const { stats, refetchStats } = useGetApplicationStats();

  const handleAddApplication = function () {
    router.push("/(dashboard)/(tabs)/workspaces/job-tracker/application-form");
  };

  const handleOpenApplication = function (application: JobApplication) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/job-tracker/application-detail",
      params: { id: application.id },
    });
  };

  const handleToggleSearch = function () {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) setSearchQuery("");
  };

  const handleRefresh = function () {
    refetchApplications();
    refetchStats();
  };

  const isFiltering = !!debouncedSearch || !!selectedStatus;
  const isFirstLoad = isFetchingApplications && applications.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="flex-row items-start justify-between px-5 pb-4 pt-2">
        <View className="flex-1 pr-3">
          <AppText type="display">Applications</AppText>
          <AppText type="subtitle" className="mt-1">
            {stats?.active ?? 0} active · {stats?.total ?? 0} total
          </AppText>
        </View>

        <IconButton
          icon={isSearchVisible ? "close-outline" : "search-outline"}
          onPress={handleToggleSearch}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 110, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isFetchingApplications && applications.length > 0}
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
              placeholder="Search company or role..."
              autoFocus
            />
          </View>
        )}

        <View className="px-5">
          <PipelineSummary stats={stats} />
        </View>

        <View className="mt-5">
          <StatusFilterChips
            selectedStatus={selectedStatus}
            counts={stats?.byStatus}
            onSelectStatus={setSelectedStatus}
          />
        </View>

        <View className="mt-5 flex-1 px-5">
          {isFirstLoad ? (
            <View className="flex-1 items-center justify-center py-16">
              <ActivityIndicator color={accent} />
            </View>
          ) : applications.length === 0 ? (
            <EmptyState
              icon="briefcase-outline"
              accentColor={accent}
              title={isFiltering ? "No applications found" : "No applications yet"}
              subtitle={
                isFiltering
                  ? "Try a different search or status filter"
                  : "Track a role you have applied to and keep its notes, recordings, and resume in one place"
              }
              {...(!isFiltering && {
                buttonText: "Add application",
                onButtonPress: handleAddApplication,
              })}
            />
          ) : (
            <ApplicationList
              applications={applications}
              onPressApplication={handleOpenApplication}
            />
          )}
        </View>
      </ScrollView>

      <Pressable
        onPress={handleAddApplication}
        className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full active:opacity-80"
        style={{
          backgroundColor: accent,
          shadowColor: accent,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={26} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
