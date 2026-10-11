import { ProfileNeededHost } from "@/components/career-profile/profile-needed-host";
import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="search" />
        <Stack.Screen name="setup" options={{ gestureEnabled: false }} />
        <Stack.Screen name="paywall" options={{ presentation: "modal" }} />
        {/* In the dashboard stack so Back returns to whichever tab opened it. */}
        <Stack.Screen name="profile-editor" />
      </Stack>

      <ProfileNeededHost />
    </>
  );
}
