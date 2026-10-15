import { AuthDivider } from "@/components/auth/auth-divider";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { AppLogo } from "@/components/shared/app-logo";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { LEGAL_LINKS } from "@/constants/links";
import { useSignup } from "@/hooks/auth/use-register";
import { signUpSchema, type SignUpFormValues } from "@/schemas/auth/sign-up";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Linking, Platform, Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { first_name: "", last_name: "", email: "", password: "" },
  });

  const { signup, isPending } = useSignup();
  const { expoPushToken } = useAuthStore();

  const onSubmit = async (data: SignUpFormValues) =>
    signup({
      ...data,
      deviceToken: expoPushToken ?? "",
      deviceType: Platform.OS,
    });

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
        <View className="mb-6">
          <AppLogo />
        </View>

        <AppText type="display">Create your account</AppText>
        <AppText type="subtitle" className="mt-1.5">
          Join Elevra today
        </AppText>

        <View className="mt-8 gap-4">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormInput<SignUpFormValues>
                control={control}
                name="first_name"
                label="First name"
                placeholder="John"
                errors={errors}
              />
            </View>

            <View className="flex-1">
              <FormInput<SignUpFormValues>
                control={control}
                name="last_name"
                label="Last name"
                placeholder="Doe"
                errors={errors}
              />
            </View>
          </View>

          <FormInput<SignUpFormValues>
            control={control}
            name="email"
            label="Email address"
            placeholder="you@example.com"
            type="email"
            autoCapitalize="none"
            autoCorrect={false}
            errors={errors}
          />

          <FormInput<SignUpFormValues>
            control={control}
            name="password"
            label="Password"
            placeholder="Min. 8 characters"
            type="password"
            autoCapitalize="none"
            autoCorrect={false}
            errors={errors}
          />

          <AppText type="caption" className="leading-[18px]">
            By creating an account, you agree to our{" "}
            <AppText
              type="link"
              className="text-xs"
              onPress={() => Linking.openURL(LEGAL_LINKS.terms)}
            >
              Terms and Conditions
            </AppText>{" "}
            and{" "}
            <AppText
              type="link"
              className="text-xs"
              onPress={() => Linking.openURL(LEGAL_LINKS.privacy)}
            >
              Privacy Policy
            </AppText>
            .
          </AppText>

          <AppButton
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
            className="mt-1"
          >
            <AppText className="font-bricolage-semibold text-white">
              {isPending ? "Creating account..." : "Create account"}
            </AppText>
          </AppButton>
        </View>

        <AuthDivider />

        <SocialAuthButtons />

        <View className="mt-8 flex-row justify-center gap-1">
          <AppText type="subtitle">Already have an account?</AppText>
          <Pressable onPress={() => router.push("/(auth)/sign-in")}>
            <AppText type="link">Log in</AppText>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
