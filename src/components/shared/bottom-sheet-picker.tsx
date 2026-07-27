import { useState, useMemo } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";
import { AppText } from "./app-text";
import { AppModal } from "./app-modal";

export interface PickerOption {
  label: string;
  value: string;
}

interface BottomSheetPickerProps {
  visible: boolean;
  selectedValue: string | null;
  options: PickerOption[];
  title: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  searchPlaceholder?: string;
}

export const BottomSheetPicker = function ({
  visible,
  selectedValue,
  options,
  title,
  placeholder = "Select an option",
  onSelect,
  onClose,
  searchPlaceholder = "Search...",
}: BottomSheetPickerProps) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [options, query]);

  // Get selected option label for display
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <AppModal
      isVisible={visible}
      onClose={onClose}
      variant="bottom-sheet"
      showHandle
      title={title}
      contentClassName="max-h-[75%]"
    >
      {/* Search */}
      <View className="mb-3 flex-row items-center rounded-xl bg-neutral-100 px-4 py-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={searchPlaceholder}
          placeholderTextColor="#74777f"
          className="flex-1 text-base text-neutral-900"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <AppText className="text-neutral-500">✕</AppText>
          </Pressable>
        )}
      </View>

      {filteredOptions.length === 0 ? (
        <View className="items-center py-10">
          <AppText className="text-neutral-500">No options found</AppText>
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
                className={`flex-row items-center justify-between rounded-xl px-4 py-3 ${
                  isSelected ? "bg-blue-50" : "bg-transparent"
                }`}
                android_ripple={{ color: "#eeeeef" }}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <AppText
                  className={isSelected ? "font-semibold text-blue-500" : ""}
                >
                  {item.label}
                </AppText>

                {isSelected && (
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                    <AppText className="text-xs font-bold text-white">
                      ✓
                    </AppText>
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
