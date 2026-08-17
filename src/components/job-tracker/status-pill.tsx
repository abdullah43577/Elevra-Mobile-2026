import { AppText } from "@/components/shared/app-text";
import { APPLICATION_STATUS_META } from "@/constants/job-applications";
import { View } from "react-native";
import { ApplicationStatus } from "../../../types/job-application";

interface Props {
  status: ApplicationStatus;
  compact?: boolean;
}

export const StatusPill = function ({ status, compact = false }: Props) {
  const meta = APPLICATION_STATUS_META[status];

  return (
    <View
      className="self-start rounded-full px-2.5 py-1"
      style={{ backgroundColor: `${meta.color}1F` }}
    >
      <AppText
        type="caption"
        className="font-bricolage-semibold"
        style={{ color: meta.color }}
      >
        {compact ? meta.short : meta.label}
      </AppText>
    </View>
  );
};
