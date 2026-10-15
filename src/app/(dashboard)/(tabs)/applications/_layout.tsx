import { Stack } from "expo-router";

// Screens are re-exported into this stack, not pushed into Workspaces: crossing
// tabs would make Back land on that tab's hub.
export default function ApplicationsLayout() {
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
      <Stack.Screen name="letter-editor" options={{ title: "Cover letter" }} />
      <Stack.Screen
        name="practice"
        options={{ title: "Practice", gestureEnabled: false }}
      />
      <Stack.Screen name="resume-builder" options={{ title: "Resume" }} />
    </Stack>
  );
}
