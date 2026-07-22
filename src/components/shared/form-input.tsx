import { clsx } from "clsx";
import { Eye, EyeSlash } from "iconsax-react-nativejs";
import { useState } from "react";
import {
  Controller,
  get,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Pressable, View } from "react-native";
import { Input, type InputProps } from "../primitives/input";
import { AppText } from "./app-text";

interface FormInputProps<TFieldValues extends FieldValues> extends Omit<
  InputProps,
  "placeholder" | "onChangeText" | "onBlur" | "value"
> {
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "numeric";
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
}

export const FormInput = function <TFieldValues extends FieldValues>({
  label,
  placeholder,
  type = "text",
  control,
  name,
  errors,
  className,
  ...rest
}: FormInputProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);
  const errorMessage = get(errors, name)?.message as string | undefined;

  return (
    <View>
      <AppText type="subtitle" className="mb-1">
        {label}
      </AppText>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          const input = (
            <Input
              placeholder={placeholder ?? "Enter text"}
              inputMode={type === "email" ? "email" : "text"}
              secureTextEntry={type === "password" && !showPassword}
              className={clsx(type === "password" && "pr-10", className)}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value as string}
              {...rest}
            />
          );

          if (type === "password") {
            return (
              <View className="relative">
                {input}
                <Pressable
                  className="absolute bottom-0 right-3 top-0 justify-center"
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeSlash size={18} color="#74777f" variant="Linear" />
                  ) : (
                    <Eye size={18} color="#74777f" variant="Linear" />
                  )}
                </Pressable>
              </View>
            );
          }

          return input;
        }}
      />

      {errorMessage && (
        <AppText type="subtitle" className="mt-1 text-error-500">
          {errorMessage}
        </AppText>
      )}
    </View>
  );
};
