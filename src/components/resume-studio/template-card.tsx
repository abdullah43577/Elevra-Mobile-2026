import { Image, TouchableOpacity, View } from "react-native";
import { AnyTemplate } from "../../../types/resume/template";
import { AppText } from "../shared/app-text";

export const TemplateCard = function ({
  item,
  onSelectTemplate,
}: {
  item: AnyTemplate;
  onSelectTemplate: (val: string) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onSelectTemplate(item.id)}
      className="w-1/2 p-2"
    >
      <View className="rounded-xl border border-line bg-surface p-3">
        {/* Thumbnail */}
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            className="h-48 w-full rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="h-48 w-full items-center justify-center rounded-lg bg-surface-muted">
            <AppText className="text-foreground-subtle">No preview</AppText>
          </View>
        )}

        {/* Info */}
        <View className="mt-2">
          <View className="flex-row items-center justify-between">
            <AppText
              type="subtitle"
              className="font-bricolage-semibold text-foreground"
            >
              {item.name}
            </AppText>
            {item.isPremium && (
              <View className="rounded-full bg-yellow-100 px-2 py-0.5">
                <AppText className="text-xs text-yellow-700">★</AppText>
              </View>
            )}
          </View>
          <AppText className="text-xs capitalize text-foreground-muted">
            {item.category}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
