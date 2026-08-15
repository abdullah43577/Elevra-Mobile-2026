import { clsx } from "clsx";
import * as Haptics from "expo-haptics";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
} from "react-native";
import { AppText } from "./app-text";

export interface AppButtonProps extends PressableProps {
  className?: string;
  onPress?: () => void;
  type?: "default" | "submit" | "secondary" | "delete";
  isLoading?: boolean;
  disabled?: boolean;
  // Preferred over passing raw `children` for text-only buttons — renders
  // through AppText with the correct foreground color for `type` baked in,
  // so a dark background can never end up with dark (unreadable) text.
  label?: string;
}

const hapticMap: Partial<
  Record<NonNullable<AppButtonProps["type"]>, () => void>
> = {
  default: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  submit: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  secondary: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  delete: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

const typeStyles: Record<NonNullable<AppButtonProps["type"]>, string> = {
  default: "bg-primary-500",
  submit: "bg-secondary-500",
  secondary: "bg-neutral-100",
  delete: "bg-error-500",
};

// Mirrors tailwind.config.js's `primary/secondary/error.foreground` tokens.
// AppButton previously never applied these, so button text color depended
// entirely on the consumer remembering to set it correctly per type.
const textStyles: Record<NonNullable<AppButtonProps["type"]>, string> = {
  default: "text-primary-foreground",
  submit: "text-secondary-foreground",
  secondary: "text-primary-500",
  delete: "text-error-foreground",
};

export const AppButton = function ({
  className,
  onPress,
  type = "default",
  isLoading = false,
  disabled = false,
  label,
  children,
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
      {isLoading ? (
        <ActivityIndicator color="#ffffff" />
      ) : label ? (
        <AppText type="label" className={textStyles[type]}>
          {label}
        </AppText>
      ) : (
        children
      )}
    </Pressable>
  );
};
