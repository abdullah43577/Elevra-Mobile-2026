import { AppText } from "@/components/shared/app-text";
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
              <AppText type="default" className="text-gray-500">
                {getGreeting()}
              </AppText>
              <View className="flex-row items-center gap-2">
                <AppText type="title" className="text-gray-900">
                  {profile?.first_name || "User"}
                </AppText>
                <AppText type="subtitle" className="text-gray-400">
                  👋
                </AppText>
              </View>
              <AppText type="subtitle" className="text-gray-400">
                {formatDate()}
              </AppText>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/(tabs)/profile")}
              className="h-12 w-12 items-center justify-center rounded-full bg-blue-100"
            >
              {profile?.profile_pic ? (
                <Image
                  source={{ uri: profile.profile_pic }}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <AppText type="title" className="text-blue-600">
                  {getInitials({ profile })}
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View className="mt-4 flex-row gap-3 px-4">
          <View className="flex-1 rounded-xl bg-blue-50 p-4">
            <AppText type="title" className="text-blue-600">
              {notes.length}
            </AppText>
            <AppText type="subtitle" className="text-gray-500">
              Notes
            </AppText>
          </View>
          <View className="flex-1 rounded-xl bg-purple-50 p-4">
            <AppText type="title" className="text-purple-600">
              {recordings.length}
            </AppText>
            <AppText type="subtitle" className="text-gray-500">
              Recordings
            </AppText>
          </View>
          <View className="flex-1 rounded-xl bg-green-50 p-4">
            <AppText type="title" className="text-green-600">
              {resumes.length}
            </AppText>
            <AppText type="subtitle" className="text-gray-500">
              Resumes
            </AppText>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-6 px-4">
          <AppText type="subtitle" className="mb-3 font-semibold text-gray-700">
            Quick Actions
          </AppText>
          <View className="flex-row gap-3">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                className="flex-1 items-center rounded-xl bg-gray-50 py-4"
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
                <AppText type="subtitle" className="text-gray-700">
                  {action.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mt-6 px-4 pb-8">
          <View className="mb-3 flex-row items-center justify-between">
            <AppText type="subtitle" className="font-semibold text-gray-700">
              Recent Activity
            </AppText>
            {recentItems.length > 0 && (
              <TouchableOpacity>
                <AppText type="link" className="text-blue-500">
                  See all
                </AppText>
              </TouchableOpacity>
            )}
          </View>

          {recentItems.length === 0 ? (
            <View className="items-center rounded-xl bg-gray-50 py-8">
              <Ionicons name="time-outline" size={40} color="#D1D5DB" />
              <AppText type="subtitle" className="mt-2 text-gray-400">
                No recent activity
              </AppText>
              <AppText type="default" className="text-gray-400">
                Your recent notes, resumes, and recordings will appear here
              </AppText>
            </View>
          ) : (
            <View className="gap-2">
              {recentItems.map((item) => {
                const iconMap: Record<string, keyof typeof Ionicons.glyphMap> =
                  {
                    Note: "document-text-outline",
                    Resume: "document-outline",
                    Recording: "mic-outline",
                  };

                const colorMap: Record<string, string> = {
                  Note: "#3B82F6",
                  Resume: "#10B981",
                  Recording: "#8B5CF6",
                };

                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      router.push({
                        pathname: item.route as any,
                        params:
                          item.type === "Note"
                            ? { id: item.id }
                            : { id: item.id },
                      });
                    }}
                    className="flex-row items-center rounded-xl border border-gray-100 bg-white p-3"
                  >
                    <View
                      className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${colorMap[item.type]}20` }}
                    >
                      <Ionicons
                        name={iconMap[item.type]}
                        size={20}
                        color={colorMap[item.type]}
                      />
                    </View>
                    <View className="flex-1">
                      <AppText
                        type="default"
                        className="font-medium text-gray-900"
                      >
                        {item.title}
                      </AppText>
                      <View className="flex-row items-center gap-2">
                        <AppText type="subtitle" className="text-gray-400">
                          {item.type}
                        </AppText>
                        <View className="h-1 w-1 rounded-full bg-gray-300" />
                        <AppText type="subtitle" className="text-gray-400">
                          {new Date(item.date).toLocaleDateString()}
                        </AppText>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#D1D5DB"
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
