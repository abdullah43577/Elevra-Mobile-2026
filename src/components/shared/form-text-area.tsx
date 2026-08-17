import {
  Controller,
  get,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { View } from "react-native";
import { TextArea, type TextAreaProps } from "../primitives/text-area";
import { AppText } from "./app-text";

interface FormTextAreaProps<TFieldValues extends FieldValues> extends Omit<
  TextAreaProps,
  "placeholder" | "onChangeText" | "onBlur" | "value"
> {
  label: string;
  placeholder?: string;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
}

export const FormTextArea = function <TFieldValues extends FieldValues>({
  label,
  placeholder,
  control,
  name,
  errors,
  ...rest
}: FormTextAreaProps<TFieldValues>) {
  const errorMessage = get(errors, name)?.message as string | undefined;

  return (
    <View>
      <AppText type="subtitle" className="mb-1">
        {label}
      </AppText>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextArea
            placeholder={placeholder ?? "Enter text"}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value as string}
            {...rest}
          />
        )}
      />

      {errorMessage && (
        <AppText type="subtitle" className="mt-1 text-danger">
          {errorMessage}
        </AppText>
      )}
    </View>
  );
};
