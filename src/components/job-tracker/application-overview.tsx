import { AppText } from "@/components/shared/app-text";
import { WORK_ARRANGEMENT_LABELS } from "@/constants/job-applications";
import { formatRelativeDate } from "@/constants/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, View } from "react-native";
import { JobApplication } from "../../../types/job-application";

interface Props {
  application: JobApplication;
  accentColor: string;
}

const formatSalary = function (application: JobApplication) {
  const { salaryMin, salaryMax, salaryCurrency } = application;
  if (!salaryMin && !salaryMax) return null;

  const currency = salaryCurrency ?? "";
  const format = (value: number) => value.toLocaleString();

  if (salaryMin && salaryMax) {
    return `${currency} ${format(salaryMin)} – ${format(salaryMax)}`.trim();
  }
  return `${currency} ${format((salaryMin ?? salaryMax) as number)}`.trim();
};

export const ApplicationOverview = function ({ application, accentColor }: Props) {
  const salary = formatSalary(application);

  const rows: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    ...(application.location ? [{ icon: "location-outline" as const, label: application.location }] : []),
    ...(application.workArrangement
      ? [{ icon: "business-outline" as const, label: WORK_ARRANGEMENT_LABELS[application.workArrangement] }]
      : []),
    ...(salary ? [{ icon: "cash-outline" as const, label: salary }] : []),
    ...(application.source ? [{ icon: "compass-outline" as const, label: application.source }] : []),
    ...(application.appliedAt
      ? [{ icon: "calendar-outline" as const, label: `Applied ${formatRelativeDate(application.appliedAt)}` }]
      : []),
  ];

  if (rows.length === 0 && !application.jobUrl) return null;

  return (
    <View className="mt-6 overflow-hidden rounded-2xl border-hairline border-line bg-surface">
      {rows.map((row, index) => (
        <View key={row.label}>
          {index > 0 && <View className="ml-12 h-px bg-line" />}
          <View className="flex-row items-center gap-3 px-4 py-3">
            <Ionicons name={row.icon} size={17} color={accentColor} />
            <AppText type="body" className="flex-1 text-[15px]">
              {row.label}
            </AppText>
          </View>
        </View>
      ))}

      {application.jobUrl && (
        <View>
          {rows.length > 0 && <View className="ml-12 h-px bg-line" />}
          <Pressable
            onPress={() => Linking.openURL(application.jobUrl as string)}
            className="flex-row items-center gap-3 px-4 py-3 active:bg-surface-muted"
          >
            <Ionicons name="open-outline" size={17} color={accentColor} />
            <AppText type="body" numberOfLines={1} className="flex-1 text-[15px]" style={{ color: accentColor }}>
              View job posting
            </AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
};
