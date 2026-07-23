import { Stack } from "expo-router";

export default function WorkspacesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Workspaces",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="resume-studio"
        options={{
          title: "Resume Studio",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="voice-notes"
        options={{
          title: "Voice Notes",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="smart-notes"
        options={{
          title: "Smart Notes",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="ai-rewriter"
        options={{
          title: "AI Rewriter",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="career-tools"
        options={{
          title: "Career Tools",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
