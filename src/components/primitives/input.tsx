import { useThemeColors } from "@/hooks/use-theme-colors";
import { clsx } from "clsx";
import { forwardRef, useState } from "react";
import { TextInput, type TextInputProps } from "react-native";

export interface InputProps extends TextInputProps {
  className?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { className, onFocus, onBlur, ...rest },
  ref,
) {
  const [isFocused, setIsFocused] = useState(false);
  const { foregroundSubtle } = useThemeColors();

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={foregroundSubtle}
      onFocus={(e) => {
        setIsFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur?.(e);
      }}
      className={clsx(
        "h-[50px] rounded-2xl border px-4 font-bricolage text-[14px] text-foreground",
        isFocused
          ? "border-accent bg-surface"
          : "border-line bg-surface-muted",
        className,
      )}
      {...rest}
    />
  );
});
