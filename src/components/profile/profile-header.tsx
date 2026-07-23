import { ActivityIndicator, Image, Pressable, View } from "react-native";
import { AppText } from "../shared/app-text";
import { useGetProfile } from "@/hooks/use-get-profile";

interface Props {
  onChangePicture: () => void;
  displayUri: string | null;
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

  const initials =
    `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.toUpperCase() ||
    "?";

  return (
    <View className="bg-white px-6 pb-6 pt-16">
      <AppText type="title" className="mb-6">
        Profile
      </AppText>

      <View className="items-center">
        <Pressable onPress={onChangePicture} className="relative mb-3">
          {displayUri ? (
            <Image
              source={{ uri: displayUri }}
              className="h-24 w-24 rounded-full"
            />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
              <AppText type="title" className="text-primary-500">
                {initials}
              </AppText>
            </View>
          )}

          {isUpdatingProfile && !isEditing && (
            <View className="absolute inset-0 items-center justify-center rounded-full bg-black/40">
              <ActivityIndicator color="white" />
            </View>
          )}

          {/* Camera badge */}
          <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-primary-500 bg-white">
            <AppText type="default" className="text-xs">
              📷
            </AppText>
          </View>
        </Pressable>

        <AppText type="default" className="text-base font-semibold">
          {profile?.first_name} {profile?.last_name}
        </AppText>
        <AppText type="default" className="text-neutral-500">
          {profile?.email}
        </AppText>
      </View>
    </View>
  );
};
