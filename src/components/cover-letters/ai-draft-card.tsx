import { AppText } from "@/components/shared/app-text";
import { Badge } from "@/components/shared/badge";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

interface Props {
  isPro: boolean;
  isDrafting: boolean;
  onPress: () => void;
}

export const AiDraftCard = function ({ isPro, isDrafting, onPress }: Props) {
  const { contentTint } = useThemeColors();
  const tint = contentTint("letter");

  return (
    <Pressable
      onPress={onPress}
      disabled={isDrafting}
      className="flex-row items-center gap-3 rounded-2xl border-hairline border-line p-4 active:opacity-70"
      style={{ backgroundColor: tint.surface }}
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 36, height: 36, backgroundColor: tint.holder }}
      >
        {isDrafting ? (
          <ActivityIndicator size="small" color={tint.color} />
        ) : (
          <Ionicons name="sparkles-outline" size={18} color={tint.color} />
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <AppText type="label">
            {isDrafting ? "Writing your draft…" : "Draft with AI"}
          </AppText>
          {!isPro && <Badge label="Pro" />}
        </View>
        <AppText type="caption" className="mt-0.5">
          A first draft from your own experience and this role, with nothing made up
        </AppText>
      </View>

      {!isDrafting && (
        <Ionicons name="chevron-forward" size={16} color={tint.color} />
      )}
    </Pressable>
  );
};
