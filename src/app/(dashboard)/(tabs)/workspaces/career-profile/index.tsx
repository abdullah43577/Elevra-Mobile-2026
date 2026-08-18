import { ProfileCompleteness } from "@/components/career-profile/profile-completeness";
import { ProfileSectionList } from "@/components/career-profile/profile-section-list";
import { AppText } from "@/components/shared/app-text";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import {
  PROFILE_SECTIONS,
  ProfileSectionId,
} from "@/constants/career-profile";
import { useGetCareerProfile } from "@/hooks/career-profile/use-get-career-profile";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { countProfileSection } from "@/utils/career-profile";
import { useRouter } from "expo-router";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CareerProfileOverview() {
  const router = useRouter();
  const { contentTint } = useThemeColors();
  const { color: accent, surface: tint } = contentTint("profile");

  const {
    careerProfile,
    hasCareerProfile,
    hasLoadedCareerProfile,
    isFetchingCareerProfile,
    refetchCareerProfile,
  } = useGetCareerProfile();

  const counts = PROFILE_SECTIONS.reduce(
    (accumulator, section) => {
      accumulator[section.id] = countProfileSection(careerProfile, section.id);
      return accumulator;
    },
    {} as Record<ProfileSectionId, number>,
  );

  const filledCount = PROFILE_SECTIONS.filter(
    (section) => counts[section.id] > 0,
  ).length;

  const handleOpenSection = function (sectionId: ProfileSectionId) {
    router.push({
      pathname: "/(dashboard)/(tabs)/workspaces/career-profile/profile-editor",
      params: { section: sectionId },
    });
  };

  if (!hasLoadedCareerProfile) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color={accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <View className="px-5 pb-4 pt-2">
        <AppText type="display">Career Profile</AppText>
        <AppText type="subtitle" className="mt-1">
          Your history in one place. New resumes prefill from it.
        </AppText>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 110, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingCareerProfile}
            onRefresh={() => refetchCareerProfile()}
            tintColor={accent}
          />
        }
      >
        {hasCareerProfile ? (
          <>
            <View className="px-5">
              <ProfileCompleteness
                filledCount={filledCount}
                totalCount={PROFILE_SECTIONS.length}
                accent={accent}
                tint={tint}
              />
            </View>

            <View className="mt-8 px-5">
              <SectionHeader title="Sections" />
              <ProfileSectionList
                counts={counts}
                accent={accent}
                tint={tint}
                onSelectSection={handleOpenSection}
              />
            </View>
          </>
        ) : (
          <EmptyState
            icon="person-outline"
            accentColor={accent}
            title="Build your career profile"
            subtitle="Enter your history once. Every resume you build after this starts already filled in."
            buttonText="Get started"
            onButtonPress={() => handleOpenSection("personalInfo")}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
