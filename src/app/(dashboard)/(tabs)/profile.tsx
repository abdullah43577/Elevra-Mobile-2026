import { AppText } from "@/components/shared/app-text";
import { AppButton } from "@/components/shared/app-button";
import { FormInput } from "@/components/shared/form-input";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { ToggleSwitch } from "@/components/shared/toggle-switch";
import { useGetProfile } from "@/hooks/use-get-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Image, ScrollView, View } from "react-native";
import { z } from "zod";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpdateSettings } from "@/hooks/profile/use-update-settings";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { profile, isFetchingProfile, logout } = useGetProfile();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { first_name: "", last_name: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
      });
    }
  }, [profile]);

  const { updateProfile, isUpdatingProfile } = useUpdateProfile({
    onSuccess: () => setIsEditing(false),
  });

  const { updateSettings, isUpdatingSettings } = useUpdateSettings();

  const onSubmit = (values: ProfileFormValues) => updateProfile(values);

  const handleThemeChange = (theme: "SYSTEM" | "LIGHT" | "DARK") =>
    updateSettings({ theme });

  const handleNotificationsToggle = (notifications: boolean) =>
    updateSettings({ notifications });

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => logout() },
    ]);
  };

  if (isFetchingProfile || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <AppText type="subtitle">Loading profile…</AppText>
      </View>
    );
  }

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() ||
    "?";

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerClassName="pb-12"
    >
      <AppText type="title" className="mb-6">
        Profile
      </AppText>

      {/* Avatar + identity */}
      <View className="mb-8 items-center">
        {profile.profile_pic ? (
          <Image
            source={{ uri: profile.profile_pic }}
            className="mb-3 h-20 w-20 rounded-full"
          />
        ) : (
          <View className="bg-primary-100 mb-3 h-20 w-20 items-center justify-center rounded-full">
            <AppText type="title">{initials}</AppText>
          </View>
        )}
        <AppText type="default" className="font-semibold">
          {profile.first_name} {profile.last_name}
        </AppText>
        <AppText type="link" className="text-primary-400">
          {profile.email}
        </AppText>
      </View>

      {/* Editable fields */}
      <View className="mb-8">
        <View className="mb-3 flex-row items-center justify-between">
          <AppText type="subtitle">Account details</AppText>
          <AppButton
            type="default"
            className="bg-transparent px-2 py-1"
            onPress={() => setIsEditing((prev) => !prev)}
          >
            <AppText type="link">{isEditing ? "Cancel" : "Edit"}</AppText>
          </AppButton>
        </View>

        {isEditing ? (
          <View className="gap-4">
            <FormInput
              label="First name"
              control={control}
              name="first_name"
              errors={errors}
            />
            <FormInput
              label="Last name"
              control={control}
              name="last_name"
              errors={errors}
            />
            <AppButton
              type="submit"
              isLoading={isUpdatingProfile}
              disabled={!isDirty || isUpdatingProfile}
              onPress={handleSubmit(onSubmit)}
            >
              <AppText type="default" className="text-white">
                {isUpdatingProfile ? "Saving…" : "Save changes"}
              </AppText>
            </AppButton>
          </View>
        ) : (
          <View className="gap-2">
            <AppText type="default">
              Profession: {profile.professionId ? "Set" : "Not set"}
            </AppText>
            {/* TODO: swap for profession name once a professions-list
                endpoint exists and can be joined/looked up here */}
          </View>
        )}
      </View>

      {/* Settings */}
      <View className="mb-8 gap-5">
        <AppText type="subtitle">Preferences</AppText>

        <View>
          <AppText type="default" className="mb-2">
            Theme
          </AppText>
          <SegmentedControl
            options={[
              { label: "System", value: "SYSTEM" },
              { label: "Light", value: "LIGHT" },
              { label: "Dark", value: "DARK" },
            ]}
            value={profile.settings?.theme ?? "SYSTEM"}
            onChange={handleThemeChange}
            disabled={isUpdatingSettings}
          />
        </View>

        <View className="flex-row items-center justify-between">
          <AppText type="default">Push notifications</AppText>
          <ToggleSwitch
            value={profile.settings?.notifications ?? true}
            onValueChange={handleNotificationsToggle}
            disabled={isUpdatingSettings}
          />
        </View>

        <View className="flex-row items-center justify-between">
          <AppText type="default">Subscription</AppText>
          <AppText type="link" className="capitalize">
            {profile.settings?.subscriptionTier ?? "free"}
          </AppText>
        </View>
      </View>

      {/* Danger zone */}
      <AppButton type="delete" onPress={handleLogout}>
        <AppText type="default" className="text-white">
          Log out
        </AppText>
      </AppButton>
    </ScrollView>
  );
}
