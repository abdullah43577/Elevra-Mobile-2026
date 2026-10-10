import { AppText } from "@/components/shared/app-text";
import { View } from "react-native";

// The label must not shrink: beside two flex-1 rules, React Native gives the
// space to the rules and wraps the text onto a second line instead.
export const AuthDivider = function () {
  return (
    <View className="my-7 flex-row items-center gap-3">
      <View className="h-px flex-1 bg-line" />
      <AppText type="caption" numberOfLines={1} className="shrink-0 tracking-[0.4px]">
        OR CONTINUE WITH
      </AppText>
      <View className="h-px flex-1 bg-line" />
    </View>
  );
};
