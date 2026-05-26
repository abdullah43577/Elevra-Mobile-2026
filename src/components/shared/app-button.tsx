import { clsx } from "clsx";
import * as Haptics from "expo-haptics";
import { Pressable, type PressableProps } from "react-native";

export interface AppButtonProps extends PressableProps {
  className?: string;
  onPress?: () => void;
  type?: "default" | "submit" | "delete";
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
  ...rest
}: AppButtonProps) {
  const handlePress = () => {
    hapticMap[type]?.();
    onPress?.();
  };

  return (
    <Pressable
      {...rest}
      className={clsx(
        "items-center justify-center rounded-lg px-4 py-3 active:opacity-75",
        typeStyles[type],
        className,
      )}
      onPress={handlePress}
    />
  );
};
