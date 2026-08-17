import { AppText } from "@/components/shared/app-text";
import { Image, Pressable, View } from "react-native";

interface Props {
  greeting: string;
  name: string;
  date: string;
  initials: string;
  avatarUri?: string | null;
  onPressAvatar: () => void;
}

export const HomeHeader = function ({
  greeting,
  name,
  date,
  initials,
  avatarUri,
  onPressAvatar,
}: Props) {
  return (
    <View className="flex-row items-start justify-between px-5 pt-2">
      <View className="flex-1 pr-4">
        <AppText type="subtitle">{greeting}</AppText>
        <AppText type="display" className="mt-1.5" numberOfLines={1}>
          Welcome, {name}
        </AppText>
        <AppText type="caption" className="mt-1">
          {date}
        </AppText>
      </View>

      <Pressable
        onPress={onPressAvatar}
        className="h-11 w-11 items-center justify-center overflow-hidden rounded-full border-hairline border-neutral-200 bg-white active:opacity-70"
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} className="h-full w-full" />
        ) : (
          <AppText type="label" className="text-neutral-500">
            {initials}
          </AppText>
        )}
      </Pressable>
    </View>
  );
};
