import { clsx } from "clsx";
import * as Haptics from "expo-haptics";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
} from "react-native";

export interface AppButtonProps extends PressableProps {
  className?: string;
  onPress?: () => void;
  type?: "default" | "submit" | "delete";
  isLoading?: boolean;
  disabled?: boolean;
}

const hapticMap: Partial<
  Record<NonNullable<AppButtonProps["type"]>, () => void>
> = {
  default: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  submit: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  delete: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

const typeStyles: Record<NonNullable<AppButtonProps["type"]>, string> = {
  default: "bg-primary-500",
  submit: "bg-secondary-500",
  delete: "bg-error-500",
};

export const AppButton = function ({
  className,
  onPress,
  type = "default",
  isLoading = false,
  disabled = false,
  ...rest
}: AppButtonProps) {
  const isDisabled = disabled || isLoading;

  const handlePress = () => {
    if (isDisabled) return;
    hapticMap[type]?.();
    onPress?.();
  };

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      className={clsx(
        "h-[52px] flex-row items-center justify-center gap-2 rounded-2xl px-4 active:opacity-75",
        typeStyles[type],
        isDisabled && "opacity-60",
        className,
      )}
      onPress={handlePress}
    >
      {isLoading ? <ActivityIndicator color="#ffffff" /> : rest.children}
    </Pressable>
  );
};
