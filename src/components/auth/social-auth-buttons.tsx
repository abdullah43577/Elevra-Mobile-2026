import { AppText } from "@/components/shared/app-text";
import { useSocialSignIn } from "@/hooks/auth/use-social-sign-in";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

interface ButtonProps {
  label: string;
  icon: "google" | "apple";
  isLoading: boolean;
  disabled: boolean;
  onPress: () => void;
}

const SocialButton = function ({
  label,
  icon,
  isLoading,
  disabled,
  onPress,
}: ButtonProps) {
  const { foreground } = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-line bg-canvas active:opacity-70 disabled:opacity-50"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={foreground} />
      ) : (
        <>
          <AntDesign name={icon} size={16} color={foreground} />
          <AppText type="body" className="font-bricolage-semibold text-[13px]">
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
};

/*
  Shared by sign-in and sign-up because the two are the same request: neither
  the app nor the user knows whether this Google account has been here before,
  so the server decides and both screens land in the same place.
*/
export const SocialAuthButtons = function () {
  const {
    continueWithGoogle,
    continueWithApple,
    pendingProvider,
    isAppleAvailable,
  } = useSocialSignIn();

  const isPending = pendingProvider !== null;

  return (
    <View className="flex-row gap-3">
      <SocialButton
        label="Google"
        icon="google"
        isLoading={pendingProvider === "GOOGLE"}
        disabled={isPending}
        onPress={continueWithGoogle}
      />

      {/*
        Rendered only where it can work. expo-apple-authentication is iOS-only
        and isAvailableAsync() is false below iOS 13, so an Apple button on
        Android would be a control that cannot ever succeed — §13's "gates are
        visible" argument does not apply to a platform that has no flow at all.
      */}
      {isAppleAvailable && (
        <SocialButton
          label="Apple"
          icon="apple"
          isLoading={pendingProvider === "APPLE"}
          disabled={isPending}
          onPress={continueWithApple}
        />
      )}
    </View>
  );
};
