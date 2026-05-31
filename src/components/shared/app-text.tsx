import { clsx } from "clsx";
import { Platform, Text, type TextProps } from "react-native";

export interface AppTextProps extends TextProps {
  type?: "default" | "title" | "subtitle" | "link" | "code";
  className?: string;
}

export const AppText = function ({
  type = "default",
  className,
  ...rest
}: AppTextProps) {
  const styleGuide = {
    default: "text-base text-primary-500",
    title: "text-2xl font-semibold",
    // heading: "text-base",
    subtitle: "text-sm tracking-[0.6px]",
    link: "text-sm text-secondary-500",
    code: `${Platform.select({ android: "font-bold" }) ?? "font-medium"} text-xs`,
  };

  return (
    <Text
      {...rest}
      className={`font-roboto font-medium ${clsx(styleGuide[type], className)}`}
    />
  );
};
