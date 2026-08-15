import { View } from "react-native";

export function SkeletonCard() {
  return (
    <View className="mb-3 rounded-2xl border-hairline border-neutral-200 bg-white p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-2">
          <View className="h-4 w-3/5 rounded-full bg-neutral-100" />
          <View className="h-3 w-full rounded-full bg-neutral-100" />
          <View className="h-3 w-2/3 rounded-full bg-neutral-100" />
        </View>

        <View className="flex-row gap-1.5">
          <View className="h-7 w-7 rounded-full bg-neutral-100" />
          <View className="h-7 w-7 rounded-full bg-neutral-100" />
          <View className="h-7 w-7 rounded-full bg-neutral-100" />
        </View>
      </View>

      <View className="mt-3 flex-row gap-1.5">
        <View className="h-5 w-16 rounded-full bg-neutral-100" />
        <View className="h-5 w-12 rounded-full bg-neutral-100" />
      </View>

      <View className="mt-3 h-3 w-28 rounded-full bg-neutral-100" />
    </View>
  );
}
