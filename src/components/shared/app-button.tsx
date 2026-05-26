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
  submit: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  delete: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
};

const typeStyles: Record<NonNullable<AppButtonProps["type"]>, string> = {
  default: "bg-primary-main",
  submit: "bg-secondary-main",
  delete: "bg-error-main",
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
