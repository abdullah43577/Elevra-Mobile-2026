import { AppText } from "@/components/shared/app-text";
import { AppButton } from "@/components/shared/app-button";
import { FormInput } from "@/components/shared/form-input";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { ToggleSwitch } from "@/components/shared/toggle-switch";
import { useGetProfile } from "@/hooks/use-get-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useUpdateProfile } from "@/hooks/profile/use-update-profile";
import { useUpdateSettings } from "@/hooks/profile/use-update-settings";
import { ProfileFormValues, profileSchema } from "@/schemas/settings/profile";
import { useImagePicker } from "@/hooks/use-image-picker";
import { ProfessionPicker } from "@/components/shared/profession-picker";

export default function Profile() {
  const { profile, isFetchingProfile, logout } = useGetProfile();
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
    defaultValues: { first_name: "", last_name: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
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
        <AppText type="subtitle">Loading profile…</AppText>
      </View>
    );
  }

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() ||
    "?";

  const displayUri = previewUri || profile.profile_pic;

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
        <Pressable onPress={handleChangePicture} className="mb-3">
          {displayUri ? (
            <Image
              source={{ uri: displayUri }}
              className="h-20 w-20 rounded-full"
            />
          ) : (
            <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <AppText type="title">{initials}</AppText>
            </View>
          )}

          {isUpdatingProfile && !isEditing && (
            <View className="absolute inset-0 items-center justify-center rounded-full bg-black/40">
              <ActivityIndicator color="white" />
            </View>
          )}
        </Pressable>

        <AppText type="link" onPress={handleChangePicture} className="mb-3">
          Change photo
        </AppText>

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

            <View>
              <AppText type="subtitle" className="mb-1">
                Profession
              </AppText>
              <Pressable
                className="border-primary-200 rounded-lg border px-3 py-3"
                onPress={() => setProfessionPickerVisible(true)}
              >
                <AppText type="default">
                  {selectedProfessionName ?? "Select a profession"}
                </AppText>
              </Pressable>
            </View>

            <AppButton
              type="submit"
              isLoading={isUpdatingProfile}
              disabled={!canSave}
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
              Profession: {profile.profession?.name ?? "Not set"}
            </AppText>
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
      <AppButton type="delete" onPress={() => setLogoutDialogVisible(true)}>
        <AppText type="default" className="text-white">
          Log out
        </AppText>
      </AppButton>

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
