import { ActiveApplications } from "@/components/home/active-applications";
import { HomeHeader } from "@/components/home/home-header";
import { SetupChecklist, SetupTask } from "@/components/home/setup-checklist";
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
import { useCandidateBackground } from "@/hooks/career-profile/use-candidate-background";
import { useGetCareerProfile } from "@/hooks/career-profile/use-get-career-profile";
import { useGetCoverLetters } from "@/hooks/cover-letters/use-get-cover-letters";
import { useGetPrepStats } from "@/hooks/interview-prep/use-get-prep-stats";
import { useGetQuestions } from "@/hooks/interview-prep/use-get-questions";
import { useGetApplications } from "@/hooks/job-applications/use-get-applications";
import { useGetResumes } from "@/hooks/resume/use-get-resumes";
import { useGetNotes } from "@/hooks/smart-notes/use-get-notes";
import { usePushPermission } from "@/hooks/notifications/use-push-permission";
import { useGetProfile } from "@/hooks/use-get-profile";
import { useProfileNeededStore } from "@/store/profile-needed";
import { useSetupStore } from "@/store/setup";
import { useGetRecordings } from "@/hooks/voice-notes/use-get-recordings";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
  const { hasLoadedCareerProfile, refetchCareerProfile } = useGetCareerProfile();
  const { hasBackground } = useCandidateBackground();
  const openProfileNeeded = useProfileNeededStore((state) => state.open);

  const { isGranted: hasPushPermission } = usePushPermission();
  const {
    hasCompletedSetup,
    isChecklistDismissed,
    isLoading: isLoadingSetup,
    checkSetupStatus,
    dismissChecklist,
  } = useSetupStore();

  // Once per mount: hasCompletedSetup stays false for anyone who skipped, so
  // returning from setup would otherwise re-push it.
  const hasOfferedSetup = useRef(false);

  useEffect(() => {
    checkSetupStatus();
  }, [checkSetupStatus]);

  useEffect(() => {
    if (isLoadingSetup || hasCompletedSetup || hasOfferedSetup.current) return;

    hasOfferedSetup.current = true;
    router.push("/(dashboard)/setup");
  }, [isLoadingSetup, hasCompletedSetup, router]);

  const setupTasks: SetupTask[] = [
    {
      id: "career-profile",
      title: "Add your work history",
      body: "Every tailored resume, letter and interview question is written from it",
      icon: "person-outline",
      isDone: hasBackground,
      onPress: openProfileNeeded,
    },
    {
      id: "notifications",
      title: "Turn on notifications",
      body: "So a quiet application gets a nudge before it goes cold",
      icon: "notifications-outline",
      isDone: hasPushPermission === true,
      onPress: () => router.push("/(dashboard)/setup"),
    },
    {
      id: "first-application",
      title: "Add the job you want next",
      body: "Paste the link and Elevra lays out every step from there",
      icon: "briefcase-outline",
      isDone: applications.length > 0,
      onPress: () => router.push("/(dashboard)/(tabs)/applications/application-form"),
    },
  ];

  // Without the loaded flag the checklist flashes on every load for users who are done.
  const shouldShowChecklist =
    hasLoadedCareerProfile &&
    hasPushPermission !== null &&
    !isChecklistDismissed &&
    !isLoadingSetup;

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
          onPressSearch={() => router.push("/(dashboard)/search")}
        />

        <View className="mt-6 px-5">
          <ActiveApplications
            applications={applications}
            onOpen={(application) =>
              router.push({
                pathname: "/(dashboard)/(tabs)/applications/application-detail",
                params: { id: application.id },
              })
            }
            onSeeAll={() => router.push("/(dashboard)/(tabs)/applications")}
            onAdd={() => router.push("/(dashboard)/(tabs)/applications/application-form")}
          />
        </View>

        <View className="mt-8 px-5">
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

        {shouldShowChecklist && (
          <View className="mt-4 px-5">
            <SetupChecklist tasks={setupTasks} onDismiss={dismissChecklist} />
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
