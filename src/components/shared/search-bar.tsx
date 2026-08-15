import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar = function ({
  value,
  onChangeText,
  onClear,
  placeholder = "Search...",
  autoFocus = false,
}: Props) {
  return (
    <View className="flex-row items-center gap-2 rounded-2xl border-hairline border-neutral-200 bg-white px-4 py-2.5">
      <Ionicons name="search-outline" size={18} color="#B4B4BF" />

      <TextInput
        className="flex-1 font-bricolage text-[15px] text-primary-500"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        placeholderTextColor="#B4B4BF"
      />

      {value.length > 0 && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color="#B4B4BF" />
        </Pressable>
      )}
    </View>
  );
};
