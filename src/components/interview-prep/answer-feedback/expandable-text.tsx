import { AppText } from "@/components/shared/app-text";
import { useState } from "react";
import { Pressable, View } from "react-native";

interface Props {
  label: string;
  text: string;
  accent: string;
}

// Folded by default: a transcript or a rewrite is worth having one tap away,
// not pushing the feedback that matters below the fold.
export const ExpandableText = function ({ label, text, accent }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mt-3">
      <Pressable onPress={() => setIsOpen((open) => !open)} hitSlop={6} className="self-start active:opacity-70">
        <AppText type="caption" style={{ color: accent }}>
          {isOpen ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        </AppText>
      </Pressable>

      {isOpen && (
        <AppText type="body" className="mt-2 text-[15px] leading-[22px]">
          {text}
        </AppText>
      )}
    </View>
  );
};
