import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";

export default function Notifications() {
  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <AppText type="title">Notifications</AppText>
      {/* TODO: notification list, empty state */}
    </View>
  );
}
