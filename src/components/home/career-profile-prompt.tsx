import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

interface Props {
  onPress: () => void;
}

/*
  Shown only while the career profile is empty, and gone for good once it is not.

  A career profile is a one-off setup, so it has no count to show in the stats
  grid and nothing to put in recent activity — but it is the thing that makes
  every resume and letter after it cheap to produce, which makes it worth one
  prompt on the front door until it is done.
*/
export const CareerProfilePrompt = function ({ onPress }: Props) {
  const { contentTint } = useThemeColors();
  const { color, surface, holder } = contentTint("profile");

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-3xl p-5 active:opacity-70"
      style={{ backgroundColor: surface }}
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 40, height: 40, backgroundColor: holder }}
      >
        <Ionicons name="person-add-outline" size={19} color={color} />
      </View>

      <View className="flex-1">
        <AppText type="label" style={{ color }}>
          Set up your career profile
        </AppText>
        <AppText type="caption" className="mt-0.5">
          Enter your history once and every resume after it starts filled in
        </AppText>
      </View>

      <Ionicons name="chevron-forward" size={18} color={color} />
    </Pressable>
  );
};
