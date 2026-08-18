import { Stack } from "expo-router";

export default function InterviewPrepLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Interview Prep" }} />
      <Stack.Screen name="question-detail" options={{ title: "Question" }} />
      <Stack.Screen
        name="practice"
        options={{ title: "Practice", gestureEnabled: false }}
      />
    </Stack>
  );
}
