import { clsx } from "clsx";
import { TextInput, type TextInputProps } from "react-native";

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
        "focus:border-primary-500 w-full rounded-lg border border-neutral-400 bg-white px-4 py-3 text-sm",
        className,
      )}
      placeholder={placeholder}
      onChangeText={onChangeText}
    />
  );
};
