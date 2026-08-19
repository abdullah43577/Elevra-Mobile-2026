import { Avatar } from "@/components/shared/avatar";
import { Badge } from "@/components/shared/badge";
import { useGetProfile } from "@/hooks/use-get-profile";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";
import { AppText } from "../shared/app-text";

interface Props {
  onChangePicture: () => void;
  displayUri: string | null | undefined;
  isUpdatingProfile: boolean;
  isEditing: boolean;
}

export const ProfileHeader = function ({
  onChangePicture,
  displayUri,
  isUpdatingProfile,
  isEditing,
}: Props) {
  const { profile } = useGetProfile();
  const { canvas } = useThemeColors();

  const initials =
    `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.toUpperCase() ||
    "?";

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    "Your profile";

  return (
    <View className="px-5 pt-2">
      <AppText type="display">Profile</AppText>

      <View className="mt-5 flex-row items-center gap-4 rounded-3xl border-hairline border-line bg-surface p-5">
        <Pressable onPress={onChangePicture} className="relative">
          <Avatar
            uri={displayUri}
            initials={initials}
            size={64}
            textType="title"
            className="bg-surface-muted"
          />

          {isUpdatingProfile && !isEditing && (
            <View className="absolute inset-0 items-center justify-center rounded-full bg-black/40">
              <ActivityIndicator color="white" />
            </View>
          )}

          <View className="absolute -bottom-0.5 -right-0.5 h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-foreground">
            <Ionicons name="camera" size={13} color={canvas} />
          </View>
        </Pressable>

        <View className="flex-1">
          <AppText
            type="default"
            className="font-bricolage-semibold text-base"
            numberOfLines={1}
          >
            {fullName}
          </AppText>
          <AppText type="caption" className="mt-0.5" numberOfLines={1}>
            {profile?.email}
          </AppText>

          {profile?.profession?.name && (
            <Badge
              label={profile.profession.name}
              variant="secondary"
              className="mt-2.5"
            />
          )}
        </View>
      </View>
    </View>
  );
};
