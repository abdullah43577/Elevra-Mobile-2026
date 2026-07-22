import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <AppText type="title">Welcome back 👋</AppText>
      <AppText type="subtitle" className="mt-1 text-neutral-500">
        Here's what's happening in your workspace.
      </AppText>
      {/* TODO: greeting, recent activity, AI usage stats, quick actions, workspace cards */}
    </View>
  );
}
