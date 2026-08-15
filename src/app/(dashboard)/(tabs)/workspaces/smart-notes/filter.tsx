import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { ScreenHeader } from "@/components/shared/screen-header";
import { SectionHeader } from "@/components/shared/section-header";
import { CONTENT_COLORS } from "@/constants/content-colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Fragment, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_OPTIONS = ["All", "Pinned", "Archived"];
const SORT_OPTIONS = ["Last updated", "Date created", "Alphabetical"];

interface OptionListProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const OptionList = function ({ options, selected, onSelect }: OptionListProps) {
  return (
    <View className="overflow-hidden rounded-2xl border-hairline border-neutral-200 bg-white">
      {options.map((option, index) => {
        const isSelected = selected === option.toLowerCase();

        return (
          <Fragment key={option}>
            {index > 0 && <View className="h-px bg-neutral-100" />}
            <Pressable
              onPress={() => onSelect(option.toLowerCase())}
              className="flex-row items-center justify-between px-4 py-3.5 active:bg-neutral-50"
            >
              <AppText type="default">{option}</AppText>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                size={21}
                color={isSelected ? CONTENT_COLORS.note : "#D5D5DE"}
              />
            </Pressable>
          </Fragment>
        );
      })}
    </View>
  );
};

export default function Filter() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("last updated");

  const handleReset = function () {
    setSelectedFilter("all");
    setSelectedSort("last updated");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScreenHeader
        title="Filter notes"
        onBack={() => router.back()}
        backIcon="close"
        right={
          <Pressable onPress={handleReset} hitSlop={8}>
            <AppText type="link">Reset</AppText>
          </Pressable>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 py-5"
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Status" />
        <OptionList
          options={STATUS_OPTIONS}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />

        <View className="h-7" />

        <SectionHeader title="Sort by" />
        <OptionList
          options={SORT_OPTIONS}
          selected={selectedSort}
          onSelect={setSelectedSort}
        />
      </ScrollView>

      <View className="border-t-hairline border-neutral-200 bg-white px-5 py-4">
        <AppButton
          type="submit"
          label="Apply filters"
          onPress={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}
