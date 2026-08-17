import { useThemeColors } from "@/hooks/use-theme-colors";
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
  default: "bg-foreground",
  submit: "bg-accent",
  secondary: "bg-surface-muted",
  delete: "bg-danger-solid",
};

// `default` is the inverted button — near-black on light, near-white on dark —
// so its label has to be the canvas, not a fixed white. The filled colour
// variants keep white in both schemes because their fills stay saturated.
const textStyles: Record<NonNullable<AppButtonProps["type"]>, string> = {
  default: "text-canvas",
  submit: "text-white",
  secondary: "text-foreground",
  delete: "text-white",
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
  const { canvas, foreground } = useThemeColors();

  // A white spinner is invisible on the secondary fill, and wrong on the
  // inverted default button once the scheme flips.
  const spinnerColor =
    type === "default" ? canvas : type === "secondary" ? foreground : "#ffffff";

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
        <ActivityIndicator color={spinnerColor} />
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
