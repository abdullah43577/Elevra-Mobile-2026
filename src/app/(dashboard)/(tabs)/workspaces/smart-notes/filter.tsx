import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/shared/app-text";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_OPTIONS = ["All", "Pinned", "Archived"];
const SORT_OPTIONS = ["Last updated", "Date created", "Alphabetical"];

export default function Filter() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("last updated");

  const handleReset = function () {
    setSelectedFilter("all");
    setSelectedSort("last updated");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-neutral-100 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="close" size={24} color="#7D7D8A" />
        </TouchableOpacity>
        <AppText type="label" className="text-[16px]">
          Filter notes
        </AppText>
        <TouchableOpacity onPress={handleReset} className="p-1">
          <AppText type="link">Reset</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <AppText type="label" className="mb-3">
          Status
        </AppText>
        <View className="gap-1">
          {STATUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setSelectedFilter(option.toLowerCase())}
              className="flex-row items-center justify-between border-b border-neutral-50 py-3"
            >
              <AppText type="body">{option}</AppText>
              {selectedFilter === option.toLowerCase() && (
                <Ionicons name="checkmark-circle" size={24} color="#5B47E8" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className="my-4 h-px bg-neutral-200" />

        <AppText type="label" className="mb-3">
          Sort by
        </AppText>
        <View className="gap-1">
          {SORT_OPTIONS.map((option) => {
            const isSelected = selectedSort === option.toLowerCase();
            return (
              <TouchableOpacity
                key={option}
                onPress={() => setSelectedSort(option.toLowerCase())}
                className="flex-row items-center justify-between border-b border-neutral-50 py-3"
              >
                <AppText type="body">{option}</AppText>
                <Ionicons
                  name={isSelected ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color={isSelected ? "#5B47E8" : "#D5D5DE"}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="border-t border-neutral-100 px-4 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center rounded-2xl bg-secondary-500 py-3"
        >
          <AppText type="body" className="font-semibold text-white">
            Apply filters
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
