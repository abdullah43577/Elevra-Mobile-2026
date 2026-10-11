import { TextArea } from "@/components/primitives/text-area";
import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

interface Props {
  initialInput?: string;
  isImporting: boolean;
  onImport: (input: string) => void;
}

export const ImportPostingCard = function ({ initialInput, isImporting, onImport }: Props) {
  const { contentTint, foregroundInverse } = useThemeColors();
  const tint = contentTint("application");
  const [input, setInput] = useState(initialInput ?? "");

  const canSubmit = input.trim().length > 0 && !isImporting;

  return (
    <View className="rounded-2xl border-hairline border-line p-4" style={{ backgroundColor: tint.surface }}>
      <View className="flex-row items-center gap-2">
        <Ionicons name="link-outline" size={16} color={tint.color} />
        <AppText type="label">Fill in from a job posting</AppText>
      </View>
      <AppText type="caption" className="mt-0.5">
        Paste the link to the job, or the posting text itself. LinkedIn needs the text.
      </AppText>

      <TextArea
        value={input}
        onChangeText={setInput}
        placeholder="https://… or the job posting"
        autoCapitalize="none"
        autoCorrect={false}
        className="mt-3 min-h-[72px]"
        style={{ textAlignVertical: "top" }}
      />

      <Pressable
        onPress={() => onImport(input)}
        disabled={!canSubmit}
        className="mt-3 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 active:opacity-80"
        style={{ backgroundColor: tint.color, opacity: canSubmit || isImporting ? 1 : 0.5 }}
      >
        {isImporting && <ActivityIndicator size="small" color={foregroundInverse} />}
        <AppText type="label" style={{ color: foregroundInverse }}>
          {isImporting ? "Reading the posting…" : "Fill in"}
        </AppText>
      </Pressable>
    </View>
  );
};
