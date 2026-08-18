import { AppText } from "@/components/shared/app-text";
import { STATUS_META } from "@/constants/interview-prep";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { InterviewPrepStats } from "../../../types/interview-prep";

interface Props {
  stats?: InterviewPrepStats;
  onPress: () => void;
}

/*
  The one thing on Home that says what to do next rather than how much exists.
  A count cannot answer "am I ready for Thursday"; a readiness figure and a
  number of weak answers can.

  Deliberately compact — Home already carries a stats grid and six actions, and
  the full three-column breakdown lives on the prep screen itself.
*/
export const PrepReadinessCard = function ({ stats, onPress }: Props) {
  const { contentTint } = useThemeColors();
  const { color: accent, surface: tint } = contentTint("interview");

  const ready = stats?.byStatus.READY ?? 0;
  const needsWork = stats?.byStatus.NEEDS_WORK ?? 0;
  const total = stats?.totalQuestions ?? 0;
  const percent = total > 0 ? Math.round((ready / total) * 100) : 0;

  const subtitle = !stats?.answered
    ? "Nothing rehearsed yet — start with five questions"
    : needsWork > 0
      ? `${needsWork} ${needsWork === 1 ? "answer needs" : "answers need"} work`
      : `${ready} ready to say out loud`;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-3xl border-hairline border-line bg-surface p-5 active:opacity-70"
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 40, height: 40, backgroundColor: `${accent}26` }}
      >
        <Ionicons name="chatbubbles-outline" size={19} color={accent} />
      </View>

      <View className="flex-1">
        <AppText type="label">Interview readiness</AppText>
        <AppText type="caption" className="mt-0.5">
          {subtitle}
        </AppText>

        <View
          className="mt-2.5 h-1.5 overflow-hidden rounded-full"
          style={{ backgroundColor: tint }}
        >
          <View
            className="h-full rounded-full"
            style={{ width: `${percent}%`, backgroundColor: accent }}
          />
        </View>
      </View>

      <AppText
        type="display"
        className="text-[22px] leading-[26px]"
        style={{ color: needsWork > 0 ? STATUS_META.NEEDS_WORK.color : accent }}
      >
        {percent}%
      </AppText>
    </Pressable>
  );
};
