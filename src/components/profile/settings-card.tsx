import { SectionHeader } from "@/components/shared/section-header";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { View } from "react-native";

interface Props {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
  children: ReactNode;
  className?: string;
}

export const SettingsCard = function ({
  title,
  actionLabel,
  onPressAction,
  children,
  className,
}: Props) {
  return (
    <View
      className={clsx(
        "overflow-hidden rounded-3xl border-hairline border-neutral-200 bg-white",
        className,
      )}
    >
      <View className="px-5 pt-4">
        <SectionHeader
          title={title}
          className="mb-0"
          {...(actionLabel && onPressAction && { actionLabel, onPressAction })}
        />
      </View>

      {children}
    </View>
  );
};
