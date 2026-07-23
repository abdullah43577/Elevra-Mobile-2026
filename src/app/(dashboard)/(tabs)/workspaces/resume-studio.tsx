import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function ResumeStudio() {
  // You can add params if needed
  // const params = useLocalSearchParams();

  return (
    <View className="flex-1">
      {/* For now, use ComingSoon or build UI shell */}
      <ComingSoon description="Resume Studio" />

      {/* Future: Build the actual UI shell for Resume Studio */}
      {/* <ResumeStudioUI /> */}
    </View>
  );
}
