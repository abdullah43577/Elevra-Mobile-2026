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
  return (
    <TextInput
      {...rest}
      className={clsx(
        "w-full rounded-lg border border-neutral-400 bg-white px-4 py-3 text-sm focus:border-primary-500",
        className,
      )}
      placeholder={placeholder}
      onChangeText={onChangeText}
      multiline
      numberOfLines={4}
    />
  );
};
