import { View } from "react-native";
import { AppText } from "../shared/app-text";
import { useGetProfile } from "@/hooks/use-get-profile";

export const AccountDetailsView = function () {
  const { profile } = useGetProfile();

  return (
    <>
      <View className="flex-row items-center justify-between border-t border-neutral-100 py-4">
        <AppText type="default" className="text-neutral-500">
          Profession
        </AppText>
        <AppText type="default" className="font-medium">
          {profile?.profession?.name ?? "Not set"}
        </AppText>
      </View>

      <View className="flex-row items-center justify-between border-t border-neutral-100 pt-4">
        <AppText type="default" className="text-neutral-500">
          Gender
        </AppText>
        <AppText type="default" className="font-medium capitalize">
          {profile?.gender?.toLowerCase() ?? "Not set"}
        </AppText>
      </View>
    </>
  );
};
