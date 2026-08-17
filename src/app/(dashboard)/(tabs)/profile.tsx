import { AccountDetailsEdit } from "@/components/profile/account-details-edit";
import { AccountDetailsView } from "@/components/profile/account-details-view";
import { AccountPreferencesCard } from "@/components/profile/account-preferences-card";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SettingsCard } from "@/components/profile/settings-card";
import { SettingsRow } from "@/components/profile/settings-row";
import { AppText } from "@/components/shared/app-text";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ProfessionPicker } from "@/components/shared/profession-picker";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpdateSettings } from "@/hooks/profile/use-update-settings";
import { useGetProfile } from "@/hooks/use-get-profile";
import { useImagePicker } from "@/hooks/use-image-picker";
import { useTheme } from "@/hooks/use-theme";
import { ThemePreference } from "@/constants/theme";
import { ProfileFormValues, profileSchema } from "@/schemas/settings/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const { preference, setPreference } = useTheme();

  const [previewUri, setPreviewUri] = useState("");
  const { pickImage } = useImagePicker();

  const professionChanged = selectedProfessionId !== profile?.professionId;
  const canSave = (isDirty || professionChanged) && !isUpdatingProfile;

  const onSubmit = (values: ProfileFormValues) =>
    updateProfile({
      ...values,
      professionId: selectedProfessionId ?? undefined,
    });

  const handleThemeChange = function (theme: ThemePreference) {
    setPreference(theme);
    updateSettings({ theme });
  };

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

  if (isFetchingProfile && !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator color="#17171C" />
      </View>
    );
  }

  const displayUri = previewUri || profile?.profile_pic;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingProfile}
            onRefresh={() => refetch()}
          />
        }
      >
        <ProfileHeader
          onChangePicture={handleChangePicture}
          displayUri={displayUri}
          isUpdatingProfile={isUpdatingProfile}
          isEditing={isEditing}
        />

        <View className="gap-4 px-5 pt-4">
          <SettingsCard
            title="Account details"
            actionLabel={isEditing ? "Cancel" : "Edit"}
            onPressAction={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? (
              <View className="px-5 pb-5 pt-4">
                <AccountDetailsEdit
                  control={control}
                  errors={errors}
                  selectedProfessionName={selectedProfessionName}
                  onOpenProfessionPicker={() =>
                    setProfessionPickerVisible(true)
                  }
                  isUpdatingProfile={isUpdatingProfile}
                  canSave={canSave}
                  onSubmit={handleSubmit(onSubmit)}
                />
              </View>
            ) : (
              <View className="mt-4">
                <AccountDetailsView />
              </View>
            )}
          </SettingsCard>

          <AccountPreferencesCard
            theme={preference}
            onThemeChange={handleThemeChange}
            isUpdatingSettings={isUpdatingSettings}
            onNotificationsToggle={handleNotificationsToggle}
          />

          <View className="overflow-hidden rounded-3xl border-hairline border-neutral-200 bg-white">
            <SettingsRow
              label="Log out"
              destructive
              onPress={() => setLogoutDialogVisible(true)}
            />
          </View>

          <AppText type="caption" className="mt-1 text-center text-neutral-300">
            Elevra v{Constants.expoConfig?.version ?? "1.0.0"}
          </AppText>
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
}
