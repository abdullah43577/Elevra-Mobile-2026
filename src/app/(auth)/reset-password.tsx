import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { useResetPassword } from "@/hooks/auth/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/schemas/auth/reset-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ResetPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useResetPassword();

  const onSubmit = async (_data: ResetPasswordFormValues) => mutate(_data);

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
        <AppText type="title">Reset password</AppText>
        <AppText type="subtitle" className="mt-1 text-neutral-500">
          Enter the code we sent you and choose a new password
        </AppText>

        {/* Form */}
        <View className="mt-8 gap-4">
          <FormInput<ResetPasswordFormValues>
            control={control}
            name="otp"
            label="Verification Code"
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
            errors={errors}
          />

          <FormInput<ResetPasswordFormValues>
            control={control}
            name="password"
            label="New Password"
            placeholder="Enter new password"
            type="password"
            autoCapitalize="none"
            autoCorrect={false}
            errors={errors}
          />

          <FormInput<ResetPasswordFormValues>
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter new password"
            type="password"
            autoCapitalize="none"
            autoCorrect={false}
            errors={errors}
          />

          {/* Submit */}
          <AppButton
            type="submit"
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
          >
            <AppText className="font-bricolage-semibold text-white">
              {isPending ? "Resetting..." : "Reset password"}
            </AppText>
          </AppButton>
        </View>

        {/* Resend code */}
        <View className="mt-8 flex-row justify-center gap-1">
          <AppText type="subtitle" className="text-neutral-500">
            Didn't receive a code?
          </AppText>
          <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
            <AppText type="link">Resend</AppText>
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
