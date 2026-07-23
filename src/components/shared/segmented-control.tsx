import { clsx } from "clsx";
import { Platform, Pressable, View } from "react-native";
import { AppText } from "./app-text";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  disabled?: boolean;
}

const activeShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  android: {
    elevation: 2,
  },
  default: {},
});

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
            style={isActive ? activeShadow : undefined}
            className={clsx(
              "flex-1 items-center rounded-md py-2",
              isActive && "bg-white",
              disabled && "opacity-50",
            )}
          >
            <AppText
              type="default"
              className={
                isActive ? "font-medium text-primary-500" : "text-primary-300"
              }
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};
