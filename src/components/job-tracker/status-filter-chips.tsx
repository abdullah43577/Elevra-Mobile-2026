import { AppText } from "@/components/shared/app-text";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_META,
} from "@/constants/job-applications";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { clsx } from "clsx";
import { Pressable, ScrollView, View } from "react-native";
import { ApplicationStatus } from "../../../types/job-application";

interface Props {
  selectedStatus: ApplicationStatus | null;
  counts?: Record<ApplicationStatus, number>;
  onSelectStatus: (status: ApplicationStatus | null) => void;
}

const chipClass = function (isSelected: boolean) {
  return clsx(
    "flex-row items-center gap-1.5 rounded-full border-hairline px-3.5 py-1.5 active:opacity-70",
    isSelected ? "border-transparent" : "border-line bg-surface",
  );
};

export const StatusFilterChips = function ({
  selectedStatus,
  counts,
  onSelectStatus,
}: Props) {
  const { contentColor } = useThemeColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-5"
    >
      <Pressable
        onPress={() => onSelectStatus(null)}
        className={chipClass(!selectedStatus)}
        style={
          !selectedStatus
            ? { backgroundColor: contentColor("application") }
            : undefined
        }
      >
        <AppText
          type="caption"
          className={
            !selectedStatus
              ? "font-bricolage-semibold text-foreground-inverse"
              : "text-foreground-muted"
          }
        >
          All
        </AppText>
      </Pressable>

      {APPLICATION_STATUSES.map((status) => {
        const meta = APPLICATION_STATUS_META[status];
        const isSelected = selectedStatus === status;
        const count = counts?.[status];

        return (
          <Pressable
            key={status}
            onPress={() => onSelectStatus(status)}
            className={chipClass(isSelected)}
            style={isSelected ? { backgroundColor: meta.color } : undefined}
          >
            {!isSelected && (
              <View
                className="rounded-full"
                style={{ width: 6, height: 6, backgroundColor: meta.color }}
              />
            )}

            <AppText
              type="caption"
              className={
                isSelected
                  ? "font-bricolage-semibold text-foreground-inverse"
                  : "text-foreground-muted"
              }
            >
              {meta.label}
              {count ? ` ${count}` : ""}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
