import { clsx } from "clsx";
import { Pressable, View } from "react-native";
import { AppText } from "./app-text";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export const SegmentedControl = function <T extends string>({
  options,
  value,
  onChange,
  disabled,
}: SegmentedControlProps<T>) {
  return (
    <View className="bg-primary-100 flex-row rounded-lg p-1">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            className={clsx(
              "flex-1 items-center rounded-md py-2",
              isActive && "bg-white shadow-sm",
            )}
          >
            <AppText
              type="default"
              className={isActive ? "text-primary-500" : "text-primary-300"}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};
