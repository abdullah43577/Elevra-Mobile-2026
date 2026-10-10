import { Stack } from "expo-router";

/*
  The letter editor, practice runner and resume builder are re-exported into
  this stack rather than pushed into the Workspaces one. Pushing across tabs
  would switch tabs, and Back would land on that tab's hub instead of the
  application the user came from.
*/
export default function ApplicationsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Applications" }} />
      <Stack.Screen name="application-detail" options={{ title: "Application" }} />
      <Stack.Screen
        name="application-form"
        options={{ title: "Application", presentation: "modal" }}
      />
      <Stack.Screen name="letter-editor" options={{ title: "Cover letter" }} />
      <Stack.Screen name="practice" options={{ title: "Practice", gestureEnabled: false }} />
      <Stack.Screen name="resume-builder" options={{ title: "Resume" }} />
    </Stack>
  );
}
