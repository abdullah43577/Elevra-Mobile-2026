import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="search" />
      {/* First-run setup. Presented over the dashboard, never as a gate — see
          the offer effect in the Home screen. */}
      <Stack.Screen name="setup" options={{ gestureEnabled: false }} />
      {/* Presented over whatever the user was doing — the upgrade prompt should
          never lose their place in the app. */}
      <Stack.Screen name="paywall" options={{ presentation: "modal" }} />
    </Stack>
  );
}
