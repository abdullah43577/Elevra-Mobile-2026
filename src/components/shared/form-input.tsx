import { View } from "react-native";
import { AppText } from "./app-text";
import { Input, type InputProps } from "../ui/input";

interface FormInputProps extends Omit<InputProps, "placeholder"> {
  label: string;
  placeholder?: string;
}

export const FormInput = function ({
  label,
  placeholder,
  ...rest
}: FormInputProps) {
  return (
    <View>
      <AppText type="subtitle" className="mb-1">
        {label}
      </AppText>

      <Input placeholder={placeholder ?? ""} {...rest} />
    </View>
  );
};
