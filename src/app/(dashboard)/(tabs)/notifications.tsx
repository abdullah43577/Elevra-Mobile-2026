import { useThemeColors } from "@/hooks/use-theme-colors";
import { useState } from "react";
import { View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";

// Temporary static data - will be replaced with API data later
const NOTIFICATIONS_DATA = [
  {
    id: "1",
    type: "summary",
    title: "AI Summary Ready",
    message: "Your note 'Q4 Project Kickoff' has been summarized",
    time: "2 min ago",
    read: false,
    icon: "sparkles",
    iconColor: "#8B5CF6",
  },
  {
    id: "2",
    type: "resume",
    title: "Resume Exported",
    message: "Your resume 'Software Engineer Resume' was exported as PDF",
    time: "1 hour ago",
    read: false,
    icon: "document-outline",
    iconColor: "#10B981",
  },
  {
    id: "3",
    type: "recording",
    title: "Recording Processed",
    message: "Voice note 'Meeting Notes' has been transcribed",
    time: "3 hours ago",
    read: true,
    icon: "mic-outline",
    iconColor: "#3B82F6",
  },
  {
    id: "4",
    type: "system",
    title: "Welcome to Elevra!",
    message:
      "Start by creating your first note, recording a voice note, or building a resume",
    time: "2 days ago",
    read: true,
    icon: "rocket-outline",
    iconColor: "#F59E0B",
  },
  {
    id: "5",
    type: "resume",
    title: "Resume Created",
    message: "Your resume 'Marketing Director Resume' was created successfully",
    time: "3 days ago",
    read: true,
    icon: "checkmark-circle-outline",
    iconColor: "#10B981",
  },
  {
    id: "6",
    type: "summary",
    title: "AI Summary Ready",
    message: "Your note 'Team Meeting Notes' has been summarized",
    time: "5 days ago",
    read: true,
    icon: "sparkles",
    iconColor: "#8B5CF6",
  },
];

export default function Notifications() {
  const { foregroundSubtle } = useThemeColors();

  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  const handleRefresh = function () {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMarkAsRead = function (id: string) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const handleMarkAllAsRead = function () {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderNotification = function ({
    item,
  }: {
    item: (typeof NOTIFICATIONS_DATA)[0];
  }) {
    return (
      <TouchableOpacity
        onPress={() => handleMarkAsRead(item.id)}
        className={`mx-4 mb-2 rounded-xl border border-line p-4 ${
          item.read ? "bg-surface" : "bg-accent-muted"
        }`}
      >
        <View className="flex-row items-start gap-3">
          {/* Icon */}
          <View
            className="mt-0.5 h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${item.iconColor}20` }}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={item.iconColor}
            />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <AppText
                type="default"
                className={`font-bricolage-medium ${
                  item.read ? "text-foreground" : "text-foreground"
                }`}
              >
                {item.title}
              </AppText>
              {!item.read && (
                <View className="h-2 w-2 rounded-full bg-accent" />
              )}
            </View>

            <AppText type="subtitle" className="mt-0.5 text-foreground-muted">
              {item.message}
            </AppText>

            <AppText type="subtitle" className="mt-1 text-xs text-foreground-subtle">
              {item.time}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <AppText type="title" className="text-foreground">
          Notifications
        </AppText>
        <View className="flex-row items-center gap-3">
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <AppText type="link" className="text-accent">
                Mark all as read
              </AppText>
            </TouchableOpacity>
          )}
          <View className="rounded-full bg-accent px-2.5 py-0.5">
            <AppText type="default" className="text-xs text-white">
              {unreadCount}
            </AppText>
          </View>
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        renderItem={renderNotification}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 4,
          flexGrow: 1,
        }}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-16">
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={foregroundSubtle}
            />
            <AppText type="title" className="mt-4 text-foreground">
              No notifications
            </AppText>
            <AppText type="subtitle" className="mt-1 text-foreground-subtle">
              You're all caught up! Check back later for updates.
            </AppText>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
