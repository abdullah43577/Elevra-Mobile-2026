import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { useResendOTP } from "@/hooks/auth/use-resend-otp";
import { useVerifyEmail } from "@/hooks/auth/use-verify-email";
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from "@/schemas/auth/verify-email";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmail() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [cooldown, setCooldown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: email ?? "", otp: "" },
  });

  const { mutate, isPending } = useVerifyEmail();

  const { resendOtp, isResending } = useResendOTP();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data: VerifyEmailFormValues) => mutate(data);

  const handleResend = () => {
    if (!email || cooldown > 0) return;
    resendOtp({ email });
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <View className="flex-1 justify-center px-6 py-10">
        {/* Header */}
        <AppText type="title">Verify your email</AppText>
        <AppText type="subtitle" className="mt-1 text-foreground-muted">
          Enter the 6-digit code sent to{" "}
          <AppText className="font-bricolage-semibold text-foreground">
            {email}
          </AppText>
        </AppText>

        {/* Form */}
        <View className="mt-8 gap-4">
          <FormInput<VerifyEmailFormValues>
            control={control}
            name="otp"
            label="Verification Code"
            placeholder="000000"
            type="numeric"
            maxLength={6}
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
              {isPending ? "Verifying..." : "Verify Email"}
            </AppText>
          </AppButton>
        </View>

        {/* Resend */}
        <View className="mt-8 flex-row justify-center gap-1">
          <AppText type="subtitle" className="text-foreground-muted">
            Didn't receive the code?
          </AppText>
          <Pressable
            onPress={handleResend}
            disabled={cooldown > 0 || isResending}
          >
            <AppText
              type="link"
              className={cooldown > 0 ? "text-foreground-subtle" : undefined}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </AppText>
          </Pressable>
        </View>

        {/* Footer */}
        <AppText type="subtitle" className="mt-6 text-center text-foreground-subtle">
          Elevra Workspace Environment V1.0
        </AppText>
      </View>
    </KeyboardAwareScrollView>
  );
}
