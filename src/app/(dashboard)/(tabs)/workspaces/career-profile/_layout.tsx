import { Stack } from "expo-router";

export default function CareerProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Career Profile" }} />
      <Stack.Screen name="profile-editor" options={{ title: "Edit profile" }} />
    </Stack>
  );
}
