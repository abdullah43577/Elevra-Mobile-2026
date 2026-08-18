import { CareerProfilePrompt } from "@/components/home/career-profile-prompt";
import { HomeHeader } from "@/components/home/home-header";
import { PrepReadinessCard } from "@/components/home/prep-readiness-card";
import { QuickActions } from "@/components/home/quick-actions";
import { RecentActivityList } from "@/components/home/recent-activity-list";
import { StatsOverview } from "@/components/home/stats-overview";
import { SectionHeader } from "@/components/shared/section-header";
import {
  formatDate,
  getGreeting,
  getInitials,
  getRecentItems,
  RecentItem,
} from "@/constants/dashboard";
import { useGetCareerProfile } from "@/hooks/career-profile/use-get-career-profile";
import { useGetCoverLetters } from "@/hooks/cover-letters/use-get-cover-letters";
import { useGetPrepStats } from "@/hooks/interview-prep/use-get-prep-stats";
import { useGetQuestions } from "@/hooks/interview-prep/use-get-questions";
import { useGetApplications } from "@/hooks/job-applications/use-get-applications";
import { useGetResumes } from "@/hooks/resume/use-get-resumes";
import { useGetNotes } from "@/hooks/smart-notes/use-get-notes";
import { useGetProfile } from "@/hooks/use-get-profile";
import { useGetRecordings } from "@/hooks/voice-notes/use-get-recordings";
import { useRouter } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { profile, refetch: refetchProfile } = useGetProfile();
  const { notes, refetchNotes } = useGetNotes();
  const { resumes, refetchResumes } = useGetResumes();
  const { recordings, refetchRecordings } = useGetRecordings();
  const { applications, refetchApplications } = useGetApplications();
  const { coverLetters, refetchCoverLetters } = useGetCoverLetters();
  const { questions, refetchQuestions } = useGetQuestions();
  const { prepStats, refetchPrepStats } = useGetPrepStats();
  const { hasCareerProfile, hasLoadedCareerProfile, refetchCareerProfile } =
    useGetCareerProfile();

  const handleRefresh = async function () {
    setRefreshing(true);
    await Promise.all([
      refetchProfile(),
      refetchNotes(),
      refetchResumes(),
      refetchRecordings(),
      refetchApplications(),
      refetchCoverLetters(),
      refetchQuestions(),
      refetchPrepStats(),
      refetchCareerProfile(),
    ]);
    setRefreshing(false);
  };

  const handleOpenItem = function (item: RecentItem) {
    router.push({ pathname: item.route as any, params: item.params });
  };

  const recentItems = getRecentItems({
    notes,
    resumes,
    recordings,
    applications,
    coverLetters,
    questions,
  });

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          greeting={getGreeting()}
          name={profile?.first_name || "there"}
          date={formatDate()}
          initials={getInitials({ profile })}
          avatarUri={profile?.profile_pic}
          onPressAvatar={() => router.push("/(dashboard)/(tabs)/profile")}
        />

        <View className="mt-6 px-5">
          <StatsOverview
            counts={{
              Note: notes.length,
              Recording: recordings.length,
              Resume: resumes.length,
              Application: applications.length,
              CoverLetter: coverLetters.length,
              InterviewQuestion: prepStats?.answered ?? 0,
            }}
          />
        </View>

        {/*
          Disappears once the profile has anything in it — and waits for the
          query to land first, or it flashes on every Home load for the users
          who already have one.
        */}
        {hasLoadedCareerProfile && !hasCareerProfile && (
          <View className="mt-4 px-5">
            <CareerProfilePrompt
              onPress={() =>
                router.push("/(dashboard)/(tabs)/workspaces/career-profile")
              }
            />
          </View>
        )}

        <View className="mt-4 px-5">
          <PrepReadinessCard
            stats={prepStats}
            onPress={() =>
              router.push("/(dashboard)/(tabs)/workspaces/interview-prep")
            }
          />
        </View>

        <View className="mt-8 px-5">
          <SectionHeader title="Create" />
          <QuickActions />
        </View>

        <View className="mt-8 px-5">
          <SectionHeader
            title="Recent activity"
            {...(recentItems.length > 0 && {
              actionLabel: "See all",
              onPressAction: () =>
                router.push("/(dashboard)/(tabs)/workspaces"),
            })}
          />
          <RecentActivityList
            items={recentItems}
            onPressItem={handleOpenItem}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
