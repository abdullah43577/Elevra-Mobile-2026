import { clsx } from "clsx";
import { Pressable, View } from "react-native";
import { AppText } from "./app-text";

interface Props {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
  className?: string;
}

export const SectionHeader = function ({
  title,
  actionLabel,
  onPressAction,
  className,
}: Props) {
  return (
    <View
      className={clsx("mb-3 flex-row items-center justify-between", className)}
    >
      <AppText type="label" className="text-[15px] leading-[20px]">
        {title}
      </AppText>

      {actionLabel && onPressAction && (
        <Pressable onPress={onPressAction} hitSlop={8}>
          <AppText type="link">{actionLabel}</AppText>
        </Pressable>
      )}
    </View>
  );
};
