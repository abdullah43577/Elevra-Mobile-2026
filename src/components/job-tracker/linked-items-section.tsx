import { AppText } from "@/components/shared/app-text";
import { SectionHeader } from "@/components/shared/section-header";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

export interface LinkedItem {
  id: string;
  title: string;
  meta?: string;
}

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  items: LinkedItem[];
  emptyLabel: string;
  addLabel: string;
  onAdd: () => void;
  onOpen?: (id: string) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export const LinkedItemsSection = function ({
  title,
  icon,
  color,
  items,
  emptyLabel,
  addLabel,
  onAdd,
  onOpen,
  onRemove,
  disabled = false,
}: Props) {
  return (
    <View className="mt-8">
      <SectionHeader title={title} actionLabel={addLabel} onPressAction={onAdd} />

      <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
        {items.length === 0 ? (
          <View className="items-center px-4 py-6">
            <AppText type="caption" className="text-center">
              {emptyLabel}
            </AppText>
          </View>
        ) : (
          items.map((item, index) => (
            <View key={item.id}>
              {index > 0 && <View className="ml-14 h-px bg-line" />}

              <Pressable
                onPress={() => onOpen?.(item.id)}
                disabled={!onOpen}
                className="flex-row items-center gap-3 px-4 py-3 active:bg-surface-muted"
              >
                <View
                  className="items-center justify-center rounded-squircle"
                  style={{
                    width: 34,
                    height: 34,
                    backgroundColor: `${color}1F`,
                  }}
                >
                  <Ionicons name={icon} size={16} color={color} />
                </View>

                <View className="flex-1">
                  <AppText type="label" numberOfLines={1}>
                    {item.title}
                  </AppText>
                  {item.meta && (
                    <AppText type="caption" className="mt-0.5">
                      {item.meta}
                    </AppText>
                  )}
                </View>

                <Pressable
                  onPress={() => onRemove(item.id)}
                  disabled={disabled}
                  hitSlop={10}
                  className="h-8 w-8 items-center justify-center rounded-full active:bg-surface-muted"
                >
                  <Ionicons name="close" size={16} color={color} />
                </Pressable>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </View>
  );
};
