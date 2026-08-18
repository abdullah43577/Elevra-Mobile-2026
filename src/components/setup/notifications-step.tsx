import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

interface Props {
  isGranted: boolean | null;
  isRequesting: boolean;
  onEnable: () => void;
}

const REASONS = [
  {
    icon: "alarm-outline",
    title: "Follow-up reminders",
    body: "A nudge when an application has gone quiet for too long, so it does not slip.",
  },
  {
    icon: "sparkles-outline",
    title: "When long work finishes",
    body: "Summaries and transcriptions tell you when they are ready, so you can leave the screen.",
  },
] as const;

export const NotificationsStep = function ({
  isGranted,
  isRequesting,
  onEnable,
}: Props) {
  const { contentTint, foregroundMuted } = useThemeColors();
  const { color, holder } = contentTint("application");

  return (
    <View>
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 44, height: 44, backgroundColor: holder }}
      >
        <Ionicons name="notifications-outline" size={21} color={color} />
      </View>

      <AppText type="display" className="mt-5">
        Stay on top of your search
      </AppText>
      <AppText type="subtitle" className="mt-2">
        The job search is mostly waiting, and waiting is where applications get
        forgotten. Notifications are how Elevra reminds you.
      </AppText>

      <View className="mt-7 overflow-hidden rounded-2xl border-hairline border-line bg-surface">
        {REASONS.map((reason, index) => (
          <View key={reason.title}>
            {index > 0 && <View className="ml-14 h-px bg-line" />}

            <View className="flex-row items-start gap-3 px-4 py-3.5">
              <Ionicons
                name={reason.icon}
                size={18}
                color={foregroundMuted}
                style={{ marginTop: 2 }}
              />
              <View className="flex-1">
                <AppText type="label" className="text-[15px]">
                  {reason.title}
                </AppText>
                <AppText type="subtitle" className="mt-0.5">
                  {reason.body}
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </View>

      {isGranted ? (
        <View className="mt-6 flex-row items-center gap-2">
          <Ionicons name="checkmark-circle" size={18} color={color} />
          <AppText type="label" style={{ color }}>
            Notifications are on
          </AppText>
        </View>
      ) : (
        <AppButton
          type="submit"
          label="Turn on notifications"
          onPress={onEnable}
          isLoading={isRequesting}
          className="mt-6"
        />
      )}
    </View>
  );
};
