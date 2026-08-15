import { clsx } from "clsx";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import { AppText } from "./app-text";

interface BadgeProps {
  label: string;
  variant?: "default" | "primary" | "secondary" | "error";
  onPress?: () => void;
  className?: string;
}

const variantStyles: Record<
  NonNullable<BadgeProps["variant"]>,
  { container: string; text: string }
> = {
  default: { container: "bg-neutral-100", text: "text-neutral-700" },
  primary: { container: "bg-primary-50", text: "text-primary-500" },
  secondary: { container: "bg-secondary-50", text: "text-secondary-500" },
  error: { container: "bg-error-50", text: "text-error-500" },
};

export const Badge = function ({
  label,
  variant = "default",
  onPress,
  className,
}: BadgeProps) {
  const { container, text } = variantStyles[variant];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const containerClass = clsx(
    "self-start rounded-full px-2.5 py-1",
    container,
    onPress && "active:opacity-70",
    className,
  );

  const content = (
    <AppText type="caption" className={clsx("font-bricolage-semibold", text)}>
      {label}
    </AppText>
  );

  if (onPress) {
    return (
      <Pressable className={containerClass} onPress={handlePress}>
        {content}
      </Pressable>
    );
  }

  return <View className={containerClass}>{content}</View>;
};
