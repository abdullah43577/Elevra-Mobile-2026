import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      {/* Presented over whatever the user was doing — the upgrade prompt should
          never lose their place in the app. */}
      <Stack.Screen name="paywall" options={{ presentation: "modal" }} />
    </Stack>
  );
}
