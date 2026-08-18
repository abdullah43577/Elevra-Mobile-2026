import { useGetUnreadCount } from "@/hooks/notifications/use-get-unread-count";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabBarIconProps = {
  color: ColorValue;
  size: number;
  focused: boolean;
};

const TAB_ICONS = {
  index: { active: "home", inactive: "home-outline" },
  workspaces: { active: "grid", inactive: "grid-outline" },
  "ai-chat": { active: "sparkles", inactive: "sparkles-outline" },
  notifications: {
    active: "notifications",
    inactive: "notifications-outline",
  },
  profile: { active: "person", inactive: "person-outline" },
} as const satisfies Record<
  string,
  {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  }
>;

const makeTabIcon = function (key: keyof typeof TAB_ICONS) {
  const TabBarIcon = function ({ color, size, focused }: TabBarIconProps) {
    return (
      <Ionicons
        name={focused ? TAB_ICONS[key].active : TAB_ICONS[key].inactive}
        size={size}
        color={color}
      />
    );
  };

  TabBarIcon.displayName = `TabBarIcon(${key})`;
  return TabBarIcon;
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { accent, foregroundSubtle, surface, line } = useThemeColors();
  const { unreadCount } = useGetUnreadCount();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: foregroundSubtle,
        tabBarStyle: {
          backgroundColor: surface,
          borderTopColor: line,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: makeTabIcon("index"),
        }}
      />
      <Tabs.Screen
        name="workspaces"
        options={{
          title: "Workspaces",
          tabBarIcon: makeTabIcon("workspaces"),
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: "AI Chat",
          tabBarIcon: makeTabIcon("ai-chat"),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: makeTabIcon("notifications"),
          ...(unreadCount > 0 && {
            tabBarBadge: unreadCount > 99 ? "99+" : unreadCount,
          }),
          tabBarBadgeStyle: {
            backgroundColor: accent,
            color: "#FFFFFF",
            fontSize: 10,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: makeTabIcon("profile"),
        }}
      />
    </Tabs>
  );
}
