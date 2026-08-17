import { HomeHeader } from "@/components/home/home-header";
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

  const handleRefresh = async function () {
    setRefreshing(true);
    await Promise.all([
      refetchProfile(),
      refetchNotes(),
      refetchResumes(),
      refetchRecordings(),
      refetchApplications(),
    ]);
    setRefreshing(false);
  };

  const handleOpenItem = function (item: RecentItem) {
    router.push({ pathname: item.route as any, params: { id: item.id } });
  };

  const recentItems = getRecentItems({
    notes,
    resumes,
    recordings,
    applications,
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
            }}
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
