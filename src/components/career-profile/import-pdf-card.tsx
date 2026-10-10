import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

interface Props {
  isImporting: boolean;
  onPress: () => void;
}

export const ImportPdfCard = function ({ isImporting, onPress }: Props) {
  const { contentTint } = useThemeColors();
  const tint = contentTint("profile");

  return (
    <Pressable
      onPress={onPress}
      disabled={isImporting}
      className="flex-row items-center gap-3 rounded-2xl border-hairline border-line p-4 active:opacity-70"
      style={{ backgroundColor: tint.surface }}
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 36, height: 36, backgroundColor: tint.holder }}
      >
        {isImporting ? (
          <ActivityIndicator size="small" color={tint.color} />
        ) : (
          <Ionicons name="document-attach-outline" size={18} color={tint.color} />
        )}
      </View>

      <View className="flex-1">
        <AppText type="label">
          {isImporting ? "Reading your resume…" : "Import from a resume PDF"}
        </AppText>
        <AppText type="caption" className="mt-0.5">
          Fills your profile from it. You review everything before it is saved.
        </AppText>
      </View>

      {!isImporting && <Ionicons name="chevron-forward" size={16} color={tint.color} />}
    </Pressable>
  );
};
