import { AppText } from "@/components/shared/app-text";
import { IconButton } from "@/components/shared/icon-button";
import { Image, Pressable, View } from "react-native";

interface Props {
  greeting: string;
  name: string;
  date: string;
  initials: string;
  avatarUri?: string | null;
  onPressAvatar: () => void;
  onPressSearch: () => void;
}

export const HomeHeader = function ({
  greeting,
  name,
  date,
  initials,
  avatarUri,
  onPressAvatar,
  onPressSearch,
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

      <View className="flex-row items-center gap-1">
        <IconButton icon="search-outline" size={22} onPress={onPressSearch} />

        <Pressable
          onPress={onPressAvatar}
          className="h-11 w-11 items-center justify-center overflow-hidden rounded-full border-hairline border-line bg-surface active:opacity-70"
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} className="h-full w-full" />
          ) : (
            <AppText type="label" className="text-foreground-muted">
              {initials}
            </AppText>
          )}
        </Pressable>
      </View>
    </View>
  );
};
