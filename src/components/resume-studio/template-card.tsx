import { Image, TouchableOpacity, View } from "react-native";
import { AppText } from "../shared/app-text";
import { AnyTemplate } from "../../../types/resume/template";

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
      <View className="rounded-xl border border-gray-200 bg-white p-3">
        {/* Thumbnail */}
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            className="h-48 w-full rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="h-48 w-full items-center justify-center rounded-lg bg-gray-100">
            <AppText className="text-gray-400">No preview</AppText>
          </View>
        )}

        {/* Info */}
        <View className="mt-2">
          <View className="flex-row items-center justify-between">
            <AppText type="subtitle" className="font-semibold text-gray-900">
              {item.name}
            </AppText>
            {item.isPremium && (
              <View className="rounded-full bg-yellow-100 px-2 py-0.5">
                <AppText className="text-xs text-yellow-700">★</AppText>
              </View>
            )}
          </View>
          <AppText className="text-xs capitalize text-gray-500">
            {item.category}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
