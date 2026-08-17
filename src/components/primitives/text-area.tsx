import { useThemeColors } from "@/hooks/use-theme-colors";
import { clsx } from "clsx";
import { TextInput, type TextInputProps } from "react-native";

export interface TextAreaProps extends TextInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  className?: string;
}

export const TextArea = function ({
  placeholder,
  onChangeText,
  className,
  ...rest
}: TextAreaProps) {
  const { foregroundSubtle } = useThemeColors();

  return (
    <TextInput
      {...rest}
      className={clsx(
        "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 font-bricolage text-sm text-foreground focus:border-accent",
        className,
      )}
      placeholderTextColor={foregroundSubtle}
      placeholder={placeholder}
      onChangeText={onChangeText}
      multiline
      numberOfLines={4}
    />
  );
};
