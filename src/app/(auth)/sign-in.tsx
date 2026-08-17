import { useThemeColors } from "@/hooks/use-theme-colors";
import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { useLogin } from "@/hooks/auth/use-login";
import { signInSchema, type SignInFormValues } from "@/schemas/auth/sign-in";
import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignIn() {
  const { foreground } = useThemeColors();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const { login, isPending } = useLogin();

  const onSubmit = async (_data: SignInFormValues) => login(_data);

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
        {/* Mark */}
        <View className="mb-6 h-10 w-10 items-center justify-center rounded-xl bg-foreground">
          <AppText className="font-bricolage-bold text-canvas">E</AppText>
        </View>

        {/* Header */}
        <AppText type="display">Welcome back</AppText>
        <AppText type="subtitle" className="mt-1.5">
          Sign in to your Elevra account
        </AppText>

        {/* Form */}
        <View className="mt-8 gap-4">
          <FormInput<SignInFormValues>
            control={control}
            name="email"
            label="Email address"
            placeholder="you@example.com"
            type="email"
            autoCapitalize="none"
            autoCorrect={false}
            errors={errors}
          />

          <FormInput<SignInFormValues>
            control={control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            autoCapitalize="none"
            autoCorrect={false}
            errors={errors}
          />

          <Pressable
            className="self-end active:opacity-60"
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <AppText type="link">Forgot password?</AppText>
          </Pressable>

          <AppButton
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
            className="mt-1"
          >
            <AppText className="font-bricolage-semibold text-white">
              {isPending ? "Signing in..." : "Sign in"}
            </AppText>
          </AppButton>
        </View>

        {/* OR divider */}
        <View className="my-7 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-line" />
          <AppText type="caption" className="tracking-[0.4px]">
            OR CONTINUE WITH
          </AppText>
          <View className="h-px flex-1 bg-line" />
        </View>

        {/* OAuth buttons — side by side, not stacked */}
        <View className="flex-row gap-3">
          <Pressable className="h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-line bg-canvas active:opacity-70">
            <AntDesign name="google" size={16} color={foreground} />
            <AppText
              type="body"
              className="font-bricolage-semibold text-[13px]"
            >
              Google
            </AppText>
          </Pressable>

          <Pressable className="h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-line bg-canvas active:opacity-70">
            <AntDesign name="apple" size={16} color={foreground} />
            <AppText
              type="body"
              className="font-bricolage-semibold text-[13px]"
            >
              Apple
            </AppText>
          </Pressable>
        </View>

        {/* Sign up link */}
        <View className="mt-8 flex-row justify-center gap-1">
          <AppText type="subtitle">Don't have an account?</AppText>
          <Pressable onPress={() => router.push("/(auth)/sign-up")}>
            <AppText type="link">Sign up</AppText>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
