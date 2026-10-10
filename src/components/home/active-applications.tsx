import { StatusPill } from "@/components/job-tracker/status-pill";
import { AppText } from "@/components/shared/app-text";
import { SectionHeader } from "@/components/shared/section-header";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { isActiveApplication, nextStep } from "@/utils/application-progress";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { JobApplication } from "../../../types/job-application";

interface Props {
  applications: JobApplication[];
  onOpen: (application: JobApplication) => void;
  onSeeAll: () => void;
  onAdd: () => void;
}

const LIMIT = 3;

export const ActiveApplications = function ({ applications, onOpen, onSeeAll, onAdd }: Props) {
  const { contentTint, foregroundSubtle } = useThemeColors();
  const tint = contentTint("application");

  const active = applications
    .filter((application) => isActiveApplication(application.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <View>
      <SectionHeader
        title="Your applications"
        {...(active.length > LIMIT && { actionLabel: "See all", onPressAction: onSeeAll })}
      />

      {active.length === 0 ? (
        <Pressable
          onPress={onAdd}
          className="flex-row items-center gap-3 rounded-2xl border-hairline border-line px-4 py-4 active:opacity-70"
          style={{ backgroundColor: tint.surface }}
        >
          <View
            className="items-center justify-center rounded-squircle"
            style={{ width: 40, height: 40, backgroundColor: tint.holder }}
          >
            <Ionicons name="add" size={20} color={tint.color} />
          </View>
          <View className="flex-1">
            <AppText type="label">Start with a job you want</AppText>
            <AppText type="caption" className="mt-0.5">
              Paste the link and Elevra walks you from posting to thank-you
            </AppText>
          </View>
        </Pressable>
      ) : (
        <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
          {active.slice(0, LIMIT).map((application, index) => {
            const step = nextStep(application, application.prep ?? { pinned: 0, rehearsed: 0 });
            return (
              <View key={application.id}>
                {index > 0 && <View className="ml-4 h-px bg-line" />}
                <Pressable
                  onPress={() => onOpen(application)}
                  className="flex-row items-center gap-3 px-4 py-3.5 active:bg-surface-muted"
                >
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <AppText type="label" numberOfLines={1} className="shrink text-[15px]">
                        {application.company}
                      </AppText>
                      <StatusPill status={application.status} />
                    </View>
                    <AppText type="caption" numberOfLines={1} className="mt-0.5">
                      {application.role}
                    </AppText>
                    {step && (
                      <AppText type="caption" numberOfLines={1} className="mt-1" style={{ color: tint.color }}>
                        Next: {step.label}
                      </AppText>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={foregroundSubtle} />
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};
