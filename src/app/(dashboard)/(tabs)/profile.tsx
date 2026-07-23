import { AppText } from "@/components/shared/app-text";
import { AppButton } from "@/components/shared/app-button";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { ToggleSwitch } from "@/components/shared/toggle-switch";
import { useGetProfile } from "@/hooks/use-get-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpdateSettings } from "@/hooks/profile/use-update-settings";
import { ProfileFormValues, profileSchema } from "@/schemas/settings/profile";
import { useImagePicker } from "@/hooks/use-image-picker";
import { ProfessionPicker } from "@/components/shared/profession-picker";
import { AccountDetailsEdit } from "@/components/profile/account-details-edit";
import { ProfileHeader } from "@/components/profile/profile-header";
import { AccountDetailsView } from "@/components/profile/account-details-view";
import { AccountPreferencesCard } from "@/components/profile/account-preferences-card";

export default function Profile() {
  const { profile, isFetchingProfile, refetch, logout } = useGetProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [professionPickerVisible, setProfessionPickerVisible] = useState(false);
  const [selectedProfessionId, setSelectedProfessionId] = useState<
    string | null
  >(null);
  const [selectedProfessionName, setSelectedProfessionName] = useState<
    string | null
  >(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { first_name: "", last_name: "", gender: undefined },
  });

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        gender: profile.gender ?? undefined,
      });

      setSelectedProfessionId(profile.professionId);
      setSelectedProfessionName(profile.profession?.name ?? null);
    }
  }, [profile]);

  const { updateProfile, isUpdatingProfile } = useUpdateProfile({
    onSuccess: () => setIsEditing(false),
  });

  const { updateSettings, isUpdatingSettings } = useUpdateSettings();

  const [previewUri, setPreviewUri] = useState("");
  const { pickImage } = useImagePicker();

  const professionChanged = selectedProfessionId !== profile?.professionId;
  const canSave = (isDirty || professionChanged) && !isUpdatingProfile;

  const onSubmit = (values: ProfileFormValues) =>
    updateProfile({
      ...values,
      professionId: selectedProfessionId ?? undefined,
    });

  const handleThemeChange = (theme: "SYSTEM" | "LIGHT" | "DARK") =>
    updateSettings({ theme });

  const handleNotificationsToggle = (notifications: boolean) =>
    updateSettings({ notifications });

  const handleChangePicture = async () => {
    const image = await pickImage();
    if (!image) return;
    setPreviewUri(image.uri);

    const form = new FormData();
    form.append("profile_pic", {
      uri: image.uri,
      name: image.name,
      type: image.type,
    } as any);
    updateProfile(form);
  };

  const handleLogout = function () {
    setLogoutDialogVisible(false);
    logout();
  };

  if (isFetchingProfile || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#121212" />
      </View>
    );
  }

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() ||
    "?";

  const displayUri = previewUri || profile.profile_pic;

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="pb-12"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isFetchingProfile}
          onRefresh={() => refetch}
        />
      }
    >
      {/* Header */}
      <ProfileHeader
        onChangePicture={handleChangePicture}
        displayUri={displayUri}
        isUpdatingProfile={isUpdatingProfile}
        isEditing={isEditing}
      />

      <View className="gap-4 px-6 pt-4">
        {/* Account details card */}
        <View className="rounded-2xl bg-white p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <AppText type="subtitle">Account details</AppText>
            <Pressable
              onPress={() => setIsEditing((prev) => !prev)}
              hitSlop={8}
            >
              <AppText type="link" className="font-medium text-primary-500">
                {isEditing ? "Cancel" : "Edit"}
              </AppText>
            </Pressable>
          </View>

          {isEditing ? (
            <AccountDetailsEdit
              control={control}
              errors={errors}
              selectedProfessionName={selectedProfessionName}
              onOpenProfessionPicker={() => setProfessionPickerVisible(true)}
              isUpdatingProfile={isUpdatingProfile}
              canSave={canSave}
              onSubmit={() => handleSubmit(onSubmit)}
            />
          ) : (
            <AccountDetailsView />
          )}
        </View>

        {/* Preferences card */}
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
                value={profile.settings?.theme ?? "SYSTEM"}
                onChange={handleThemeChange}
                disabled={isUpdatingSettings}
              />
            </View>

            <View className="flex-row items-center justify-between border-t border-neutral-100 pt-4">
              <AppText type="default">Push notifications</AppText>
              <ToggleSwitch
                value={profile.settings?.notifications ?? true}
                onValueChange={handleNotificationsToggle}
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
                  {profile.settings?.subscriptionTier ?? "free"}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <AccountPreferencesCard
          onThemeChange={handleThemeChange}
          isUpdatingSettings={isUpdatingSettings}
          onNotificationsToggle={handleNotificationsToggle}
        />

        {/* Danger zone */}
        <AppButton
          type="delete"
          onPress={() => setLogoutDialogVisible(true)}
          className="mt-2"
        >
          <AppText type="default" className="font-semibold text-white">
            Log out
          </AppText>
        </AppButton>
      </View>

      <ProfessionPicker
        visible={professionPickerVisible}
        selectedId={selectedProfessionId}
        onSelect={(id, name) => {
          setSelectedProfessionId(id);
          setSelectedProfessionName(name);
        }}
        onClose={() => setProfessionPickerVisible(false)}
      />

      <ConfirmDialog
        visible={logoutDialogVisible}
        title="Log out"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        variant="delete"
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogVisible(false)}
      />
    </ScrollView>
  );
}
