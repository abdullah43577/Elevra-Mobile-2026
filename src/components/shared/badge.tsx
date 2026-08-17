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
  default: { container: "bg-surface-muted", text: "text-foreground" },
  primary: { container: "bg-surface-muted", text: "text-foreground" },
  secondary: { container: "bg-accent-muted", text: "text-accent" },
  error: { container: "bg-danger-muted", text: "text-danger" },
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
