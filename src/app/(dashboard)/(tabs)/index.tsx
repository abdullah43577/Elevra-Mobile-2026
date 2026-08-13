import { AppText } from "@/components/shared/app-text";
import { CONTENT_COLORS } from "@/constants/content-colors";
import {
  formatDate,
  getGreeting,
  getInitials,
  getRecentItems,
  quickActions,
} from "@/constants/dashboard";
import { useGetResumes } from "@/hooks/resume/use-get-resumes";
import { useGetNotes } from "@/hooks/smart-notes/use-get-notes";
import { useGetProfile } from "@/hooks/use-get-profile";
import { useGetRecordings } from "@/hooks/voice-notes/use-get-recordings";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_META: Record<
  "Note" | "Recording" | "Resume",
  { color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  Note: { color: CONTENT_COLORS.note, icon: "document-text-outline" },
  Recording: { color: CONTENT_COLORS.recording, icon: "mic-outline" },
  Resume: { color: CONTENT_COLORS.resume, icon: "document-outline" },
};

export default function Home() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { profile, refetch: refetchProfile } = useGetProfile();
  const { notes, refetchNotes } = useGetNotes();
  const { resumes, refetchResumes } = useGetResumes();
  const { recordings, refetchRecordings } = useGetRecordings();

  const handleRefresh = function () {
    setRefreshing(true);
    refetchProfile();
    refetchNotes();
    refetchResumes();
    refetchRecordings();
  };

  const recentItems = getRecentItems({ notes, resumes, recordings });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <AppText type="subtitle">{getGreeting()}</AppText>
              <AppText type="title">{profile?.first_name || "User"} 👋</AppText>
              <AppText type="caption" className="mt-0.5">
                {formatDate()}
              </AppText>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/(tabs)/profile")}
              className="h-12 w-12 items-center justify-center rounded-full bg-secondary-50"
            >
              {profile?.profile_pic ? (
                <Image
                  source={{ uri: profile.profile_pic }}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <AppText type="title" className="text-secondary-600">
                  {getInitials({ profile })}
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View className="mt-5 flex-row gap-3 px-4">
          <View
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: `${CATEGORY_META.Note.color}12` }}
          >
            <AppText type="title" style={{ color: CATEGORY_META.Note.color }}>
              {notes.length}
            </AppText>
            <AppText type="caption" className="mt-0.5">
              Notes
            </AppText>
          </View>
          <View
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: `${CATEGORY_META.Recording.color}12` }}
          >
            <AppText
              type="title"
              style={{ color: CATEGORY_META.Recording.color }}
            >
              {recordings.length}
            </AppText>
            <AppText type="caption" className="mt-0.5">
              Recordings
            </AppText>
          </View>
          <View
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: `${CATEGORY_META.Resume.color}12` }}
          >
            <AppText type="title" style={{ color: CATEGORY_META.Resume.color }}>
              {resumes.length}
            </AppText>
            <AppText type="caption" className="mt-0.5">
              Resumes
            </AppText>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-7 px-4">
          <AppText type="label" className="mb-3">
            Quick actions
          </AppText>
          <View className="flex-row gap-3">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                className="flex-1 items-center rounded-2xl py-4"
                style={{ backgroundColor: `${action.color}10` }}
              >
                <View
                  className="mb-2 h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={24}
                    color={action.color}
                  />
                </View>
                <AppText type="caption" className="text-primary-500">
                  {action.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mt-7 px-4 pb-8">
          <View className="mb-3 flex-row items-center justify-between">
            <AppText type="label">Recent activity</AppText>
            {recentItems.length > 0 && (
              <TouchableOpacity>
                <AppText type="link">See all</AppText>
              </TouchableOpacity>
            )}
          </View>

          {recentItems.length === 0 ? (
            <View className="items-center rounded-2xl bg-neutral-50 py-8">
              <Ionicons name="time-outline" size={40} color="#D5D5DE" />
              <AppText type="subtitle" className="mt-2">
                No recent activity
              </AppText>
              <AppText type="caption" className="mt-1 px-8 text-center">
                Your recent notes, resumes, and recordings will appear here
              </AppText>
            </View>
          ) : (
            <View className="gap-2">
              {recentItems.map((item) => {
                const meta =
                  CATEGORY_META[item.type as keyof typeof CATEGORY_META];

                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      router.push({
                        pathname: item.route as any,
                        params: { id: item.id },
                      });
                    }}
                    className="flex-row items-center rounded-2xl border border-neutral-100 bg-white p-3"
                  >
                    <View
                      className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${meta.color}20` }}
                    >
                      <Ionicons name={meta.icon} size={20} color={meta.color} />
                    </View>
                    <View className="flex-1">
                      <AppText type="body" className="font-bricolage-medium">
                        {item.title}
                      </AppText>
                      <View className="flex-row items-center gap-2">
                        <AppText type="caption">{item.type}</AppText>
                        <View className="h-1 w-1 rounded-full bg-neutral-300" />
                        <AppText type="caption">
                          {new Date(item.date).toLocaleDateString()}
                        </AppText>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#D5D5DE"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
