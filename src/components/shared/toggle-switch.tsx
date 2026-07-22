import { clsx } from "clsx";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch = function ({
  value,
  onValueChange,
  disabled,
}: ToggleSwitchProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onValueChange(!value);
      }}
      className={clsx(
        "h-6 w-11 justify-center rounded-full p-0.5",
        value ? "bg-secondary-500" : "bg-primary-200",
        disabled && "opacity-50",
      )}
    >
      <View
        className={clsx(
          "h-5 w-5 rounded-full bg-white shadow",
          value ? "self-end" : "self-start",
        )}
      />
    </Pressable>
  );
};
