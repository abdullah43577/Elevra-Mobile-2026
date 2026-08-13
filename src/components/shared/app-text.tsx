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
    default: "text-base leading-[22px] text-primary-500 font-bricolage",
    display:
      "text-[28px] leading-[34px] tracking-tight text-primary-500 font-bricolage-bold",
    title:
      "text-2xl leading-[30px] tracking-tight text-primary-500 font-bricolage-bold",
    subtitle: "text-[14px] leading-[20px] text-neutral-500 font-bricolage",
    body: "text-base leading-[22px] text-primary-500 font-bricolage",
    label:
      "text-[13px] leading-[18px] tracking-[0.2px] text-primary-500 font-bricolage-semibold",
    caption: "text-xs leading-[16px] text-neutral-400 font-bricolage",
    link: "text-sm text-secondary-500 font-bricolage-semibold",
    code: clsx(
      "text-xs",
      Platform.select({ android: "font-bricolage-bold" }) ??
        "font-bricolage-medium",
    ),
  } as const;

  return <Text {...rest} className={clsx(styleGuide[type], className)} />;
};
