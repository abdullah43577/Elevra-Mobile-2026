import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { Pressable } from "react-native";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  size?: number;
  disabled?: boolean;
  className?: string;
}

export const IconButton = function ({
  icon,
  onPress,
  color = "#47474F",
  size = 20,
  disabled = false,
  className,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={4}
      className={clsx(
        "h-9 w-9 items-center justify-center rounded-full active:bg-neutral-100",
        disabled && "opacity-40",
        className,
      )}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
};
