import { View } from "react-native";
import { Input, type InputProps } from "../ui/input";
import { AppText } from "./app-text";
import { TextArea } from "../ui/text-area";

interface FormTextAreaProps extends Omit<InputProps, "placeholder"> {
  label: string;
  placeholder?: string;
}

export const FormTextArea = function ({
  label,
  placeholder,
  ...rest
}: FormTextAreaProps) {
  return (
    <View>
      <AppText type="subtitle" className="mb-1">
        {label}
      </AppText>

      <TextArea placeholder={placeholder ?? "Enter comment"} {...rest} />
    </View>
  );
};
