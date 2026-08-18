import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface Props {
  hasProfile: boolean;
  onPrefill: () => void;
  onSetUpProfile: () => void;
}

/*
  Sits on the first step because that is where a from-scratch retype begins,
  but it fills every section, not just this one.
*/
export const PrefillCard = function ({
  hasProfile,
  onPrefill,
  onSetUpProfile,
}: Props) {
  const { contentTint } = useThemeColors();
  const { color, surface, holder } = contentTint("profile");

  return (
    <Pressable
      onPress={hasProfile ? onPrefill : onSetUpProfile}
      className="mt-4 flex-row items-center gap-3 rounded-2xl p-4 active:opacity-70"
      style={{ backgroundColor: surface }}
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 36, height: 36, backgroundColor: holder }}
      >
        <Ionicons
          name={hasProfile ? "flash-outline" : "person-add-outline"}
          size={18}
          color={color}
        />
      </View>

      <View className="flex-1">
        <AppText type="label" style={{ color }}>
          {hasProfile ? "Prefill from my profile" : "Set up your career profile"}
        </AppText>
        <AppText type="caption" className="mt-0.5">
          {hasProfile
            ? "Fill every section with your saved career history"
            : "Save your history once and every new resume starts filled in"}
        </AppText>
      </View>

      <Ionicons name="chevron-forward" size={18} color={color} />
    </Pressable>
  );
};
