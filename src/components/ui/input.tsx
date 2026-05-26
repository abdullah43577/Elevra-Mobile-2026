import { TextInput, type TextInputProps } from "react-native";
import { clsx } from "clsx";

export interface InputProps extends TextInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  className?: string;
}

export const Input = function ({
  placeholder,
  onChangeText,
  className,
  ...rest
}: InputProps) {
  return (
    <TextInput
      {...rest}
      className={clsx(
        "w-full rounded-lg border border-neutral-outline-variant bg-white px-4 py-3 text-sm focus:border-primary-main",
        className,
      )}
      placeholder={placeholder}
      onChangeText={onChangeText}
    />
  );
};
