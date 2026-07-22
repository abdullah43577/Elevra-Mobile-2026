import { AppButton } from "@/components/shared/app-button";
import { AppText } from "@/components/shared/app-text";
import { FormInput } from "@/components/shared/form-input";
import { signInSchema, type SignInFormValues } from "@/schemas/auth/sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import { useLogin } from "@/hooks/auth/use-login";

export default function SignIn() {
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
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <View className="flex-1 justify-center px-6 py-10">
        {/* Header */}
        <AppText type="title">Welcome back</AppText>
        <AppText type="subtitle" className="mt-1 text-neutral-500">
          Sign in to your Elevra account
        </AppText>

        {/* Form */}
        <View className="mt-8 gap-4">
          <FormInput<SignInFormValues>
            control={control}
            name="email"
            label="Email Address"
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

          {/* Forgot password */}
          <Pressable
            className="self-end active:opacity-60"
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <AppText type="link">Forgot password?</AppText>
          </Pressable>

          {/* Submit */}
          <AppButton
            type="submit"
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
          >
            <AppText className="font-semibold text-white">
              {isPending ? "Signing in..." : "Sign in"}
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
            <AntDesign name="google" size={18} color="#000" />
            <AppText className="font-semibold">Continue with Google</AppText>
          </Pressable>

          <Pressable className="flex-row items-center justify-center gap-2 rounded-lg border border-neutral-300 py-3 active:opacity-75">
            <AntDesign name="apple" size={18} color="#000" />
            <AppText className="font-semibold">Continue with Apple</AppText>
          </Pressable>
        </View>

        {/* Sign up link */}
        <View className="mt-8 flex-row justify-center gap-1">
          <AppText type="subtitle" className="text-neutral-500">
            Don't have an account?
          </AppText>
          <Pressable onPress={() => router.push("/(auth)/sign-up")}>
            <AppText type="link">Sign up</AppText>
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
