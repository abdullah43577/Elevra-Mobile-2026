import {
  Controller,
  get,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { View } from "react-native";
import { AppText } from "./app-text";
import { SegmentedControl } from "./segmented-control";

interface FormSegmentedControlProps<
  TFieldValues extends FieldValues,
  TOption extends string,
> {
  label: string;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  options: { label: string; value: TOption }[];
  errors?: FieldErrors<TFieldValues>;
  disabled?: boolean;
}

export const FormSegmentedControl = function <
  TFieldValues extends FieldValues,
  TOption extends string,
>({
  label,
  control,
  name,
  options,
  errors,
  disabled,
}: FormSegmentedControlProps<TFieldValues, TOption>) {
  const errorMessage = get(errors, name)?.message as string | undefined;

  return (
    <View>
      <AppText type="subtitle" className="mb-1">
        {label}
      </AppText>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <SegmentedControl
            options={options}
            value={value as TOption | null | undefined}
            onChange={onChange}
            disabled={disabled}
          />
        )}
      />

      {errorMessage && (
        <AppText type="subtitle" className="mt-1 text-error-500">
          {errorMessage}
        </AppText>
      )}
    </View>
  );
};
