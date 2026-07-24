import { Stack } from "expo-router";

export default function SmartNotesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the stack header globally
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Smart Notes",
          headerShown: true,
          headerBackTitle: "Workspaces",
        }}
      />
      <Stack.Screen
        name="note-editor"
        options={{
          title: "Note",
          headerBackTitle: "Back",
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="folders"
        options={{
          title: "Folders",
          headerBackTitle: "Back",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="tags"
        options={{
          title: "Tags",
          headerBackTitle: "Back",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="filter"
        options={{
          title: "Filter",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
