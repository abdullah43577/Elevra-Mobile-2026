import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { signUpSchema, type SignUpFormValues } from "@/schemas/auth/sign-up";
import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Platform, Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSignup } from "@/hooks/auth/use-register";
import { useAuthStore } from "@/store/auth";

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
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <View className="flex-1 justify-center px-6 py-10">
        {/* Mark */}
        <View className="mb-6 h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
          <AppText className="font-bold text-white">E</AppText>
        </View>

        {/* Header */}
        <AppText type="display">Create your account</AppText>
        <AppText type="subtitle" className="mt-1.5">
          Join Elevra today
        </AppText>

        {/* Form */}
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

          {/* Terms */}
          <AppText type="caption" className="leading-[18px]">
            By creating an account, you agree to our{" "}
            <AppText type="link" className="text-xs">
              Terms and Conditions
            </AppText>{" "}
            and{" "}
            <AppText type="link" className="text-xs">
              Privacy Policy
            </AppText>
            .
          </AppText>

          {/* Submit */}
          <AppButton
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
            className="mt-1"
          >
            <AppText className="font-semibold text-white">
              {isPending ? "Creating account..." : "Create account"}
            </AppText>
          </AppButton>
        </View>

        {/* OR divider */}
        <View className="my-7 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-neutral-200" />
          <AppText type="caption" className="tracking-[0.4px]">
            OR CONTINUE WITH
          </AppText>
          <View className="h-px flex-1 bg-neutral-200" />
        </View>

        {/* OAuth buttons — side by side, not stacked */}
        <View className="flex-row gap-3">
          <Pressable className="h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 active:opacity-70">
            <AntDesign name="google" size={16} color="#17171C" />
            <AppText type="body" className="text-[13px] font-semibold">
              Google
            </AppText>
          </Pressable>

          <Pressable className="h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 active:opacity-70">
            <AntDesign name="apple" size={16} color="#17171C" />
            <AppText type="body" className="text-[13px] font-semibold">
              Apple
            </AppText>
          </Pressable>
        </View>

        {/* Sign in link */}
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
