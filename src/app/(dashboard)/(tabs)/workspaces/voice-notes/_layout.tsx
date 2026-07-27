import { Stack } from "expo-router";

export default function VoiceNotesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Voice Notes",
        }}
      />
      <Stack.Screen
        name="recorder"
        options={{
          title: "Record",
          headerShown: false,
          headerBackTitle: "Back",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="playback"
        options={{
          title: "Playback",
          headerShown: false,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
