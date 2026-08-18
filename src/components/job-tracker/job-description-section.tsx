import { AppText } from "@/components/shared/app-text";
import { SectionHeader } from "@/components/shared/section-header";
import { useState } from "react";
import { Pressable, View } from "react-native";

interface Props {
  jobDescription: string;
}

const COLLAPSED_LINES = 6;

/*
  Collapsed by default, because a pasted posting routinely runs to several
  thousand characters and rendering it inline would push the linked resume,
  letter, notes and recordings off the bottom of the detail screen — the parts
  someone opens this screen to reach.
*/
export const JobDescriptionSection = function ({ jobDescription }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="mt-8">
      <SectionHeader
        title="Job description"
        actionLabel={isExpanded ? "Show less" : "Show more"}
        onPressAction={() => setIsExpanded((value) => !value)}
      />

      <Pressable
        onPress={() => setIsExpanded((value) => !value)}
        className="rounded-2xl border-hairline border-line bg-surface px-4 py-3.5 active:bg-surface-muted"
      >
        <AppText
          type="body"
          className="text-[15px]"
          numberOfLines={isExpanded ? undefined : COLLAPSED_LINES}
        >
          {jobDescription}
        </AppText>
      </Pressable>
    </View>
  );
};
