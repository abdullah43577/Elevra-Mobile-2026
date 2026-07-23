import { View } from "react-native";
import { AppText } from "../shared/app-text";
import { SegmentedControl } from "../shared/segmented-control";
import { useGetProfile } from "@/hooks/use-get-profile";
import { ToggleSwitch } from "../shared/toggle-switch";

interface Props {
  onThemeChange: (str: "SYSTEM" | "LIGHT" | "DARK") => void;
  isUpdatingSettings: boolean;
  onNotificationsToggle: (arg: boolean) => void;
}

export const AccountPreferencesCard = function ({
  onThemeChange,
  isUpdatingSettings,
  onNotificationsToggle,
}: Props) {
  const { profile } = useGetProfile();

  return (
    <View className="rounded-2xl bg-white p-5">
      <AppText type="subtitle" className="mb-4">
        Preferences
      </AppText>

      <View className="gap-5">
        <View>
          <AppText
            type="default"
            className="mb-2 text-sm font-medium text-neutral-700"
          >
            Theme
          </AppText>
          <SegmentedControl
            options={[
              { label: "System", value: "SYSTEM" },
              { label: "Light", value: "LIGHT" },
              { label: "Dark", value: "DARK" },
            ]}
            value={profile?.settings?.theme ?? "SYSTEM"}
            onChange={onThemeChange}
            disabled={isUpdatingSettings}
          />
        </View>

        <View className="flex-row items-center justify-between border-t border-neutral-100 pt-4">
          <AppText type="default">Push notifications</AppText>
          <ToggleSwitch
            value={profile?.settings?.notifications ?? true}
            onValueChange={onNotificationsToggle}
            disabled={isUpdatingSettings}
          />
        </View>

        <View className="flex-row items-center justify-between border-t border-neutral-100 pt-4">
          <AppText type="default">Subscription</AppText>
          <View className="rounded-full bg-primary-50 px-3 py-1">
            <AppText
              type="default"
              className="text-xs font-semibold capitalize text-primary-500"
            >
              {profile?.settings?.subscriptionTier ?? "free"}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};
