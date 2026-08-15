import { AppText } from "@/components/shared/app-text";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export const EmptyActivity = function () {
  return (
    <View className="items-center rounded-2xl border-hairline border-neutral-200 bg-white px-8 py-10">
      <View className="mb-3 h-11 w-11 items-center justify-center rounded-full bg-neutral-100">
        <Ionicons name="time-outline" size={20} color="#B4B4BF" />
      </View>
      <AppText type="label">Nothing here yet</AppText>
      <AppText type="caption" className="mt-1 text-center">
        Notes, recordings, and resumes you work on will show up here.
      </AppText>
    </View>
  );
};
