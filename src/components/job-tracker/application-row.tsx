import { AppText } from "@/components/shared/app-text";
import { APPLICATION_STATUS_META } from "@/constants/job-applications";
import { formatRelativeDate } from "@/constants/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { JobApplication } from "../../../types/job-application";
import { StatusPill } from "./status-pill";

interface Props {
  application: JobApplication;
  onPress: () => void;
}

export const ApplicationRow = function ({ application, onPress }: Props) {
  const meta = APPLICATION_STATUS_META[application.status];

  const linkedCount =
    (application._count?.linkedNotes ?? 0) +
    (application._count?.linkedRecordings ?? 0);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3.5 active:bg-surface-muted"
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{
          width: 40,
          height: 40,
          backgroundColor: `${meta.color}1F`,
        }}
      >
        <Ionicons name={meta.icon} size={19} color={meta.color} />
      </View>

      <View className="flex-1">
        <AppText type="label" numberOfLines={1} className="text-[15px]">
          {application.company}
        </AppText>
        <AppText type="subtitle" numberOfLines={1} className="mt-0.5">
          {application.role}
        </AppText>

        <View className="mt-1.5 flex-row items-center gap-2">
          <StatusPill status={application.status} compact />

          <AppText type="caption">
            {formatRelativeDate(application.appliedAt ?? application.updatedAt)}
          </AppText>

          {linkedCount > 0 && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="link-outline" size={11} color={meta.color} />
              <AppText type="caption">{linkedCount}</AppText>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color={meta.color} />
    </Pressable>
  );
};
