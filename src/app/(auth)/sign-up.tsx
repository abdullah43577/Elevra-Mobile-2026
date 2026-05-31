import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { signUpSchema, type SignUpFormValues } from "@/schemas/auth/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (_data: SignUpFormValues) => {
    // TODO: implement sign-up logic
  };

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
        <AppText type="title">Create your account</AppText>
        <AppText type="subtitle" className="mt-1 text-neutral-500">
          Join Elevra today
        </AppText>

        {/* Form */}
        <View className="mt-8 gap-4">
          <FormInput<SignUpFormValues>
            control={control}
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            errors={errors}
          />

          <FormInput<SignUpFormValues>
            control={control}
            name="email"
            label="Email Address"
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

          {/* Terms */}
          <AppText type="subtitle" className="text-neutral-500">
            By creating an account, you agree to our{" "}
            <AppText type="link">Terms and Conditions</AppText> and{" "}
            <AppText type="link">Privacy Policy</AppText>.
          </AppText>

          {/* Submit */}
          <AppButton
            type="submit"
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            <AppText className="font-semibold text-white">
              {isSubmitting ? "Creating account..." : "Create account"}
            </AppText>
          </AppButton>
        </View>

        {/* OR divider */}
        <View className="my-6 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-neutral-200" />
          <AppText type="subtitle" className="text-neutral-500">
            OR continue with
          </AppText>
          <View className="h-px flex-1 bg-neutral-200" />
        </View>

        {/* OAuth buttons */}
        <View className="gap-3">
          <Pressable className="flex-row items-center justify-center gap-2 rounded-lg border border-neutral-300 py-3 active:opacity-75">
            <AppText className="font-semibold">Continue with Google</AppText>
          </Pressable>
          <Pressable className="flex-row items-center justify-center gap-2 rounded-lg border border-neutral-300 py-3 active:opacity-75">
            <AppText className="font-semibold">Continue with Apple</AppText>
          </Pressable>
        </View>

        {/* Sign in link */}
        <View className="mt-8 flex-row justify-center gap-1">
          <AppText type="subtitle" className="text-neutral-500">
            Already have an account?
          </AppText>
          <Pressable onPress={() => router.push("/(auth)/sign-in")}>
            <AppText type="link">Log in</AppText>
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
