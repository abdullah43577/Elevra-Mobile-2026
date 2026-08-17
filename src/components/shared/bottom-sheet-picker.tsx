import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";
import { AppModal } from "./app-modal";
import { AppText } from "./app-text";

export interface PickerOption {
  label: string;
  value: string;
  description?: string;
}

interface BottomSheetPickerProps {
  visible: boolean;
  selectedValue: string | null;
  options: PickerOption[];
  title: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  searchPlaceholder?: string;
  emptyLabel?: string;
  showSearch?: boolean;
  accentColor?: string;
}

export const BottomSheetPicker = function ({
  visible,
  selectedValue,
  options,
  title,
  onSelect,
  onClose,
  searchPlaceholder = "Search...",
  emptyLabel = "No options found",
  showSearch = true,
  accentColor,
}: BottomSheetPickerProps) {
  const [query, setQuery] = useState("");
  const { accent, foregroundSubtle } = useThemeColors();

  const tint = accentColor ?? accent;

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [options, query]);

  return (
    <AppModal
      isVisible={visible}
      onClose={onClose}
      variant="bottom-sheet"
      showHandle
      title={title}
      contentClassName="max-h-[75%]"
    >
      {showSearch && (
        <View className="mb-3 flex-row items-center rounded-xl bg-surface-muted px-4 py-3">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor={foregroundSubtle}
            className="flex-1 font-bricolage text-base text-foreground"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={foregroundSubtle} />
            </Pressable>
          )}
        </View>
      )}

      {filteredOptions.length === 0 ? (
        <View className="items-center py-10">
          <AppText className="text-foreground-muted">{emptyLabel}</AppText>
        </View>
      ) : (
        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-1" />}
          renderItem={({ item }) => {
            const isSelected = item.value === selectedValue;

            return (
              <Pressable
                className="flex-row items-center justify-between rounded-xl px-4 py-3 active:opacity-70"
                style={
                  isSelected ? { backgroundColor: `${tint}1F` } : undefined
                }
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <View className="flex-1 pr-3">
                  <AppText
                    numberOfLines={1}
                    className={isSelected ? "font-bricolage-semibold" : ""}
                    style={isSelected ? { color: tint } : undefined}
                  >
                    {item.label}
                  </AppText>
                  {item.description && (
                    <AppText type="caption" numberOfLines={1} className="mt-0.5">
                      {item.description}
                    </AppText>
                  )}
                </View>

                {isSelected && (
                  <View
                    className="h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: tint }}
                  >
                    <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      )}
    </AppModal>
  );
};
