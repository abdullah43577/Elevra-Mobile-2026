import { AppText } from "@/components/shared/app-text";
import {
  APPLICATION_STATUS_META,
  PIPELINE_STATUSES,
} from "@/constants/job-applications";
import { Fragment } from "react";
import { View } from "react-native";
import { ApplicationStats } from "../../../types/job-application";

interface Props {
  stats?: ApplicationStats;
}

export const PipelineSummary = function ({ stats }: Props) {
  return (
    <View className="flex-row items-stretch rounded-3xl border-hairline border-line bg-surface px-2 py-4">
      {PIPELINE_STATUSES.map((status, index) => {
        const meta = APPLICATION_STATUS_META[status];

        return (
          <Fragment key={status}>
            {index > 0 && <View className="w-px bg-line" />}

            <View className="flex-1 items-center">
              <AppText
                type="display"
                className="text-[24px] leading-[28px]"
                style={{ color: meta.color }}
              >
                {stats?.byStatus[status] ?? 0}
              </AppText>
              <AppText type="caption" className="mt-0.5">
                {meta.short}
              </AppText>
            </View>
          </Fragment>
        );
      })}
    </View>
  );
};
