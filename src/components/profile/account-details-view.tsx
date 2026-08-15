import { useGetProfile } from "@/hooks/use-get-profile";
import { toTitleCase } from "@/provider/utils";
import { SettingsRow } from "./settings-row";

export const AccountDetailsView = function () {
  const { profile } = useGetProfile();

  return (
    <>
      <SettingsRow
        label="Profession"
        value={profile?.profession?.name ?? "Not set"}
        withDivider
      />
      <SettingsRow
        label="Gender"
        value={toTitleCase(profile?.gender, "Not set")}
        withDivider
      />
    </>
  );
};
