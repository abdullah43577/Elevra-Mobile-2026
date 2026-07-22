import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/auth/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = useForgotPassword();

  const onSubmit = async (_data: ForgotPasswordFormValues) => mutate(_data);

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <View className="flex-1 justify-center px-6 py-10">
        {/* Header */}
        <AppText type="title">Forgot password?</AppText>
        <AppText type="subtitle" className="mt-1 text-neutral-500">
          Enter your email and we'll send you a code to reset your password
        </AppText>

        {/* Form */}
        <View className="mt-8 gap-4">
          <FormInput<ForgotPasswordFormValues>
            control={control}
            name="email"
            label="Email Address"
            placeholder="you@example.com"
            type="email"
            autoCapitalize="none"
            autoCorrect={false}
            errors={errors}
          />

          {/* Submit */}
          <AppButton
            type="submit"
            disabled={isPending}
            // onPress={handleSubmit(onSubmit)}
            onPress={() => router.push("/(auth)/reset-password")}
          >
            <AppText className="font-semibold text-white">
              {isPending ? "Sending..." : "Send reset code"}
            </AppText>
          </AppButton>
        </View>

        {/* Back to sign in */}
        <View className="mt-8 flex-row justify-center gap-1">
          <AppText type="subtitle" className="text-neutral-500">
            Remembered your password?
          </AppText>
          <Pressable onPress={() => router.back()}>
            <AppText type="link">Sign in</AppText>
          </Pressable>
        </View>

        {/* Footer */}
        <AppText type="subtitle" className="mt-6 text-center text-neutral-400">
          Elevra Workspace Environment V1.0
        </AppText>
      </View>
    </KeyboardAwareScrollView>
  );
}
