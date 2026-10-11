import { Illustration } from "@/components/illustrations/illustration";
import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

interface Props {
  hasBackground: boolean;
}

const USES = [
  "A resume tailored to each job",
  "Cover letters and follow-ups in your voice",
  "Interview questions built around your experience",
];

export const ProfileStep = function ({ hasBackground }: Props) {
  const { contentColor, foregroundMuted } = useThemeColors();
  const accent = contentColor("profile");

  return (
    <View>
      <View className="self-start">
        <Illustration name="setupProfile" color={accent} size={148} />
      </View>

      <AppText type="display" className="mt-4">
        {hasBackground ? "Your work history is in" : "Add your work history"}
      </AppText>
      <AppText type="subtitle" className="mt-2">
        {hasBackground
          ? "Everything Elevra writes for you starts from it. You can change it any time from Workspaces."
          : "Elevra writes from your own experience and never makes any of it up. Import your resume and it takes about a minute."}
      </AppText>

      <View className="mt-7 gap-3">
        {USES.map((use) => (
          <View key={use} className="flex-row items-center gap-3">
            <Ionicons
              name={hasBackground ? "checkmark-circle" : "ellipse-outline"}
              size={18}
              color={hasBackground ? accent : foregroundMuted}
            />
            <AppText type="body" className="flex-1">
              {use}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
};
