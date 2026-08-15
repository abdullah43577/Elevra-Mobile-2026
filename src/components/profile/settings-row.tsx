import { AppText } from "@/components/shared/app-text";
import { clsx } from "clsx";
import { ChevronRight } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";

interface Props {
  label: string;
  value?: string;
  /** Replaces the value text — use for a Badge, ToggleSwitch, or similar. */
  right?: ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  withDivider?: boolean;
}

export const SettingsRow = function ({
  label,
  value,
  right,
  onPress,
  destructive = false,
  withDivider = false,
}: Props) {
  const content = (
    <>
      <AppText
        type="default"
        className={clsx(
          "flex-1",
          destructive
            ? "text-center font-bricolage-semibold text-error-500"
            : "text-neutral-500",
        )}
      >
        {label}
      </AppText>

      {right ??
        (value !== undefined && (
          <AppText type="default" className="font-bricolage-medium">
            {value}
          </AppText>
        ))}

      {onPress && !destructive && <ChevronRight size={16} color="#B4B4BF" />}
    </>
  );

  const className = clsx(
    "flex-row items-center gap-3 px-5 py-4",
    withDivider && "border-t-hairline border-neutral-100",
    onPress && "active:bg-neutral-50",
  );

  if (onPress) {
    return (
      <Pressable className={className} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View className={className}>{content}</View>;
};
