import { Stack } from "expo-router";

export default function CoverLettersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Cover Letters" }} />
      <Stack.Screen name="letter-editor" options={{ title: "Cover letter" }} />
    </Stack>
  );
}
