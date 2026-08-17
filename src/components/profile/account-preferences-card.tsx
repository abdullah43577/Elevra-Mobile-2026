import { useGetProfile } from "@/hooks/use-get-profile";
import { ThemePreference } from "@/constants/theme";
import { toTitleCase } from "@/provider/utils";
import { View } from "react-native";
import { AppText } from "../shared/app-text";
import { Badge } from "../shared/badge";
import { SegmentedControl } from "../shared/segmented-control";
import { ToggleSwitch } from "../shared/toggle-switch";
import { SettingsCard } from "./settings-card";
import { SettingsRow } from "./settings-row";

interface Props {
  theme: ThemePreference;
  onThemeChange: (str: ThemePreference) => void;
  isUpdatingSettings: boolean;
  onNotificationsToggle: (arg: boolean) => void;
}

export const AccountPreferencesCard = function ({
  theme,
  onThemeChange,
  isUpdatingSettings,
  onNotificationsToggle,
}: Props) {
  const { profile } = useGetProfile();

  return (
    <SettingsCard title="Preferences">
      <View className="px-5 pb-4 pt-4">
        <AppText type="default" className="mb-2.5 text-foreground-muted">
          Appearance
        </AppText>
        <SegmentedControl
          options={[
            { label: "System", value: "SYSTEM" },
            { label: "Light", value: "LIGHT" },
            { label: "Dark", value: "DARK" },
          ]}
          value={theme}
          onChange={onThemeChange}
        />
      </View>

      <SettingsRow
        label="Push notifications"
        withDivider
        right={
          <ToggleSwitch
            value={profile?.settings?.notifications ?? true}
            onValueChange={onNotificationsToggle}
            disabled={isUpdatingSettings}
          />
        }
      />

      <SettingsRow
        label="Subscription"
        withDivider
        right={
          <Badge
            label={toTitleCase(profile?.settings?.subscriptionTier, "Free")}
            variant="secondary"
          />
        }
      />
    </SettingsCard>
  );
};
