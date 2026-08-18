import { Pressable, View, useWindowDimensions } from "react-native";
import { AnyTemplate } from "../../../types/resume/template";
import { AppText } from "../shared/app-text";
import { Badge } from "../shared/badge";
import { TemplatePreview } from "./template-preview";

export const TemplateCard = function ({
  item,
  onSelectTemplate,
}: {
  item: AnyTemplate;
  onSelectTemplate: (val: string) => void;
}) {
  const { width: screenWidth } = useWindowDimensions();

  // Two columns inside a 20px gutter with a 12px gap between cards.
  const cardWidth = (screenWidth - 40 - 12) / 2;
  const previewWidth = cardWidth - 2;

  return (
    <Pressable
      onPress={() => onSelectTemplate(item.id)}
      style={{ width: cardWidth }}
      className="active:opacity-70"
    >
      <View className="overflow-hidden rounded-2xl border-hairline border-line">
        <TemplatePreview template={item} width={previewWidth} />
      </View>

      <View className="mt-2 flex-row items-center justify-between gap-2">
        <AppText type="label" numberOfLines={1} className="flex-1">
          {item.name}
        </AppText>
        {item.isPremium && <Badge label="Pro" variant="secondary" />}
      </View>

      <AppText type="caption" numberOfLines={2} className="mt-0.5">
        {item.description}
      </AppText>
    </Pressable>
  );
};
