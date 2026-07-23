import { View } from "react-native";

export function SkeletonCard() {
  return (
    <View className="mx-4 my-1.5 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          {/* Title skeleton */}
          <View className="h-5 w-3/4 rounded bg-gray-200" />
          {/* Content skeleton */}
          <View className="mt-2 space-y-1">
            <View className="h-3 w-full rounded bg-gray-200" />
            <View className="h-3 w-2/3 rounded bg-gray-200" />
          </View>
          {/* Tags skeleton */}
          <View className="mt-2 flex-row gap-2">
            <View className="h-5 w-12 rounded bg-gray-200" />
            <View className="h-5 w-12 rounded bg-gray-200" />
          </View>
          {/* Timestamp skeleton */}
          <View className="mt-2 h-3 w-24 rounded bg-gray-200" />
        </View>
        {/* Action buttons skeleton */}
        <View className="flex-row gap-1">
          <View className="h-6 w-6 rounded-full bg-gray-200" />
          <View className="h-6 w-6 rounded-full bg-gray-200" />
          <View className="h-6 w-6 rounded-full bg-gray-200" />
        </View>
      </View>
    </View>
  );
}
