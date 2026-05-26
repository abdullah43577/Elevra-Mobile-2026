import { Platform, Text, type TextProps } from "react-native";
import { clsx } from "clsx";

export interface AppTextProps extends TextProps {
  type?: "default" | "title" | "heading" | "subtitle" | "link" | "code";
  className?: string;
}

export const AppText = function ({
  type = "default",
  className,
  ...rest
}: AppTextProps) {
  const styleGuide = {
    default: "text-sm text-primary-main",
    title: "text-2xl font-semibold",
    heading: "text-base",
    subtitle: "text-xs tracking-[0.6px]",
    link: "text-sm text-secondary-main",
    code: `${Platform.select({ android: "font-bold" }) ?? "font-medium"} text-xs`,
  };

  return (
    <Text
      {...rest}
      className={`font-roboto font-medium ${clsx(styleGuide[type], className)}`}
    />
  );
};
