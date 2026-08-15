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

  return (
    <TextInput
      ref={ref}
      placeholderTextColor="#B4B4BF"
      onFocus={(e) => {
        setIsFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur?.(e);
      }}
      className={clsx(
        "h-[50px] rounded-2xl border px-4 font-bricolage text-[14px] text-primary-500",
        isFocused
          ? "border-secondary-500 bg-white"
          : "border-neutral-200 bg-neutral-50",
        className,
      )}
      {...rest}
    />
  );
});
