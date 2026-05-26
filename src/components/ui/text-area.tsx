import { TextInput, type TextInputProps } from "react-native";
import { clsx } from "clsx";

interface TextAreaProps extends TextInputProps {
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
        "w-full rounded-lg border border-neutral-outline-variant bg-white px-4 py-3 text-sm focus:border-primary-main",
        className,
      )}
      placeholder={placeholder}
      onChangeText={onChangeText}
      multiline
      numberOfLines={4}
    />
  );
};
