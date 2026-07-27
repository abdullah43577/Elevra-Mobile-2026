import { Stack } from "expo-router";

export default function DevLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="generate-thumbnails"
        options={{
          title: "Generate Thumbnails",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
