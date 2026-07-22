import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";

export default function Profile() {
  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <AppText type="title">Profile</AppText>
      {/* TODO: account settings, subscription, dark mode toggle, notification prefs, storage */}
    </View>
  );
}
