import { Stack } from "expo-router";

export default function JobTrackerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Applications" }} />
      <Stack.Screen
        name="application-detail"
        options={{ title: "Application" }}
      />
      <Stack.Screen
        name="application-form"
        options={{ title: "Application", presentation: "modal" }}
      />
    </Stack>
  );
}
