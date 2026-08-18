import { AppText } from "@/components/shared/app-text";
import { STATUS_META } from "@/constants/interview-prep";
import { Fragment } from "react";
import { View } from "react-native";
import { InterviewPrepStats } from "../../../types/interview-prep";

interface Props {
  stats?: InterviewPrepStats;
  accent: string;
  tint: string;
}

/*
  Readiness, not completion. The number that matters before an interview is how
  many answers you would be happy to give out loud tomorrow — not how many boxes
  you have filled in.
*/
export const ReadinessSummary = function ({ stats, accent, tint }: Props) {
  const ready = stats?.byStatus.READY ?? 0;
  const needsWork = stats?.byStatus.NEEDS_WORK ?? 0;
  const total = stats?.totalQuestions ?? 0;
  const percent = total > 0 ? Math.round((ready / total) * 100) : 0;

  const columns = [
    { label: "Ready", value: ready, color: STATUS_META.READY.color },
    { label: "Needs work", value: needsWork, color: STATUS_META.NEEDS_WORK.color },
    {
      label: "Untouched",
      value: stats?.notStarted ?? 0,
      color: STATUS_META.DRAFT.color,
    },
  ];

  return (
    <View className="rounded-3xl border-hairline border-line bg-surface p-5">
      <View className="flex-row items-end justify-between">
        <View className="flex-1 pr-3">
          <AppText type="label">Interview readiness</AppText>
          <AppText type="caption" className="mt-1">
            {stats?.practisedThisWeek
              ? `${stats.practisedThisWeek} rehearsed in the last 7 days`
              : "Nothing rehearsed in the last 7 days"}
          </AppText>
        </View>

        <AppText
          type="display"
          className="text-[26px] leading-[30px]"
          style={{ color: accent }}
        >
          {percent}%
        </AppText>
      </View>

      <View
        className="mt-4 h-1.5 overflow-hidden rounded-full"
        style={{ backgroundColor: tint }}
      >
        <View
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: accent }}
        />
      </View>

      <View className="mt-4 flex-row items-stretch">
        {columns.map((column, index) => (
          <Fragment key={column.label}>
            {index > 0 && <View className="w-px bg-line" />}
            <View className="flex-1 items-center">
              <AppText
                type="title"
                className="text-[19px] leading-[24px]"
                style={{ color: column.color }}
              >
                {column.value}
              </AppText>
              <AppText type="caption" className="mt-0.5">
                {column.label}
              </AppText>
            </View>
          </Fragment>
        ))}
      </View>
    </View>
  );
};
