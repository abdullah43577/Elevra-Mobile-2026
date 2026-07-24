import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Filter() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("all");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Filter Notes</Text>
        <TouchableOpacity className="p-1">
          <Text className="font-semibold text-blue-500">Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="mb-3 text-sm font-semibold text-gray-700">Status</Text>
        <View className="space-y-2">
          {["All", "Pinned", "Archived"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setSelectedFilter(option.toLowerCase())}
              className="flex-row items-center justify-between border-b border-gray-50 py-3"
            >
              <Text className="text-base text-gray-900">{option}</Text>
              {selectedFilter === option.toLowerCase() && (
                <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className="my-4 h-px bg-gray-200" />

        <AppText className="mb-3 text-sm font-semibold text-gray-700">
          Sort By
        </AppText>
        <View className="space-y-2">
          {["Last updated", "Date created", "Alphabetical"].map((option) => (
            <TouchableOpacity
              key={option}
              className="flex-row items-center justify-between border-b border-gray-50 py-3"
            >
              <Text className="text-base text-gray-900">{option}</Text>
              <Ionicons name="radio-button-off" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="border-t border-gray-100 px-4 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-lg bg-blue-500 py-3"
        >
          <Text className="text-center font-semibold text-white">
            Apply Filters
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
