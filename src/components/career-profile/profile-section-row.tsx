import { AppText } from "@/components/shared/app-text";
import { ProfileSection } from "@/constants/career-profile";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface Props {
  section: ProfileSection;
  count: number;
  accent: string;
  tint: string;
  onPress: () => void;
}

export const ProfileSectionRow = function ({
  section,
  count,
  accent,
  tint,
  onPress,
}: Props) {
  const { foregroundSubtle } = useThemeColors();
  const isFilled = count > 0;

  const summary = !isFilled
    ? section.hint
    : section.id === "personalInfo"
      ? "Added"
      : `${count} ${count === 1 ? singular(section.unit) : section.unit}`;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3.5 active:bg-surface-muted"
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{
          width: 36,
          height: 36,
          backgroundColor: isFilled ? tint : undefined,
        }}
      >
        <Ionicons
          name={section.icon}
          size={18}
          color={isFilled ? accent : foregroundSubtle}
        />
      </View>

      <View className="flex-1">
        <AppText type="label">{section.label}</AppText>
        <AppText type="caption" className="mt-0.5">
          {summary}
        </AppText>
      </View>

      <Ionicons name="chevron-forward" size={18} color={foregroundSubtle} />
    </Pressable>
  );
};

// "roles" -> "role", "certifications" -> "certification". Every unit in
// PROFILE_SECTIONS is a regular plural, so trimming the s is enough.
const singular = function (unit: string) {
  return unit.endsWith("s") ? unit.slice(0, -1) : unit;
};
