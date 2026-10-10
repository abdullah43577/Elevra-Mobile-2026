import { TextArea } from "@/components/primitives/text-area";
import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

interface Props {
  accent: string;
  isWriting: boolean;
  onWrite: (details: { interviewerName?: string; points?: string }) => void;
}

export const MessageForm = function ({ accent, isWriting, onWrite }: Props) {
  const { foregroundSubtle, foregroundInverse } = useThemeColors();
  const [interviewerName, setInterviewerName] = useState("");
  const [points, setPoints] = useState("");

  return (
    <View>
      <AppText type="subtitle" className="mb-2">
        Who is it to? (optional)
      </AppText>
      <TextInput
        value={interviewerName}
        onChangeText={setInterviewerName}
        placeholder="e.g. Tolu Adeyemi"
        placeholderTextColor={foregroundSubtle}
        autoCapitalize="words"
        className="w-full rounded-lg border border-line-strong bg-surface px-4 py-3 font-bricolage text-sm text-foreground"
      />

      <AppText type="subtitle" className="mb-2 mt-4">
        Anything to mention? (optional)
      </AppText>
      <TextArea
        value={points}
        onChangeText={setPoints}
        placeholder="What you talked about, a question you want to ask…"
        className="min-h-[72px]"
        style={{ textAlignVertical: "top" }}
      />
      <AppText type="caption" className="mt-1.5">
        The draft only uses what you write here, your notes on this application and any voice memos linked to it.
      </AppText>

      <Pressable
        onPress={() => onWrite({ interviewerName, points })}
        disabled={isWriting}
        className="mt-5 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3.5 active:opacity-80"
        style={{ backgroundColor: accent }}
      >
        {isWriting && <ActivityIndicator size="small" color={foregroundInverse} />}
        <AppText type="label" style={{ color: foregroundInverse }}>
          {isWriting ? "Writing…" : "Write the draft"}
        </AppText>
      </Pressable>
    </View>
  );
};
