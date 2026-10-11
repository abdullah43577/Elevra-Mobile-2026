import { clsx } from "clsx";
import { Platform, Text, type TextProps } from "react-native";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge so a passed className beats the type's own (clsx kept both), with the
// font-size/line-height conflict off: an arbitrary text-[15px] sets no line height here.
const mergeClasses = extendTailwindMerge({
  override: { conflictingClassGroups: { "font-size": [] } },
});

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
    default: "text-base leading-[22px] text-foreground font-bricolage",
    display:
      "text-[28px] leading-[34px] tracking-tight text-foreground font-bricolage-bold",
    title:
      "text-2xl leading-[30px] tracking-tight text-foreground font-bricolage-bold",
    subtitle: "text-[14px] leading-[20px] text-foreground-muted font-bricolage",
    body: "text-base leading-[22px] text-foreground font-bricolage",
    label:
      "text-[13px] leading-[18px] tracking-[0.2px] text-foreground font-bricolage-semibold",
    caption: "text-xs leading-[16px] text-foreground-subtle font-bricolage",
    link: "text-sm text-accent font-bricolage-semibold",
    code: clsx(
      "text-xs",
      Platform.select({ android: "font-bricolage-bold" }) ??
        "font-bricolage-medium",
    ),
  } as const;

  return <Text {...rest} className={mergeClasses(styleGuide[type], className)} />;
};
