import { clsx } from "clsx";
import { Platform, Text, type TextProps } from "react-native";

export interface AppTextProps extends TextProps {
  type?:
    | "default"
    | "display"
    | "title"
    | "subtitle"
    | "body"
    | "label"
    | "caption"
    | "link"
    | "code";
  className?: string;
}

export const AppText = function ({
  type = "default",
  className,
  ...rest
}: AppTextProps) {
  const styleGuide = {
    default: "text-base leading-[22px] text-primary-500",
    display:
      "text-[28px] leading-[34px] font-bold tracking-tight text-primary-500",
    title: "text-2xl leading-[30px] font-bold tracking-tight text-primary-500",
    subtitle: "text-[14px] leading-[20px] text-neutral-500",
    body: "text-base leading-[22px] text-primary-500",
    label:
      "text-[13px] leading-[18px] font-semibold tracking-[0.2px] text-primary-500",
    caption: "text-xs leading-[16px] text-neutral-400",
    link: "text-sm font-semibold text-secondary-500",
    code: `${Platform.select({ android: "font-bold" }) ?? "font-medium"} text-xs`,
  } as const;

  return (
    <Text
      {...rest}
      className={clsx("font-roboto", styleGuide[type], className)}
    />
  );
};
