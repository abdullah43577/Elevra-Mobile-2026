import { AppText } from "@/components/shared/app-text";
import { SectionHeader } from "@/components/shared/section-header";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { AnyTemplate } from "../../../types/resume/template";

interface Props {
  template?: AnyTemplate;
  accent: string;
  onPress: () => void;
}

/*
  Cover letters reuse the resume template catalogue rather than owning one, so
  a letter and the resume sent with it share their header, colour and type.
*/
export const LetterTemplateRow = function ({
  template,
  accent,
  onPress,
}: Props) {
  const { foregroundSubtle } = useThemeColors();

  return (
    <View>
      <SectionHeader title="Style" />

      <Pressable
        onPress={onPress}
        className="flex-row items-center gap-3 rounded-2xl border-hairline border-line bg-surface px-4 py-3.5 active:bg-surface-muted"
      >
        <View
          className="items-center justify-center rounded-squircle"
          style={{ width: 36, height: 36, backgroundColor: `${accent}26` }}
        >
          <Ionicons name="color-palette-outline" size={18} color={accent} />
        </View>

        <View className="flex-1">
          <AppText type="label">{template?.name ?? "Choose a template"}</AppText>
          <AppText type="caption" className="mt-0.5">
            Matches the resume you send with it
          </AppText>
        </View>

        <Ionicons name="chevron-forward" size={18} color={foregroundSubtle} />
      </Pressable>
    </View>
  );
};
