import { Stack } from "expo-router";
import {
  BricolageGrotesque_200ExtraLight,
  BricolageGrotesque_300Light,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/bricolage-grotesque";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useOnboardingStore } from "@/store/onboarding";
import { useGetProfile } from "@/hooks/use-get-profile";
import { useAuthStore } from "@/store/auth";
import { ErrorBoundary } from "./error-boundary";
import useNotifications from "@/hooks/use-notification";
import { StatusBar } from "expo-status-bar";
import { useSyncTheme, useTheme } from "@/hooks/use-theme";
import { useSyncDeviceToken } from "@/hooks/notifications/use-sync-device-token";
import { useSyncPurchaser } from "@/hooks/subscriptions/use-sync-purchaser";

export const AppNavigator = function () {
  const [loaded] = useFonts({
    "BricolageGrotesque-ExtraLight": BricolageGrotesque_200ExtraLight,
    "BricolageGrotesque-Light": BricolageGrotesque_300Light,
    "BricolageGrotesque-Regular": BricolageGrotesque_400Regular,
    "BricolageGrotesque-Medium": BricolageGrotesque_500Medium,
    "BricolageGrotesque-SemiBold": BricolageGrotesque_600SemiBold,
    "BricolageGrotesque-Bold": BricolageGrotesque_700Bold,
    "BricolageGrotesque-ExtraBold": BricolageGrotesque_800ExtraBold,
  });
  const { hasToken, isLoading: authLoading, checkAuthStatus } = useAuthStore();
  const { expoPushToken } = useNotifications();
  const { isFetchingProfile, profile } = useGetProfile();
  const isAuthenticated = !!profile && hasToken === true;

  useSyncTheme();
  useSyncDeviceToken(expoPushToken);
  useSyncPurchaser(profile?.id);
  const { scheme, colors } = useTheme();

  const {
    hasOnboarded,
    isLoading: onboardingLoading,
    checkOnboardingStatus,
  } = useOnboardingStore();

  useEffect(() => {
    checkAuthStatus();
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    const isReady =
      loaded && !authLoading && !onboardingLoading && !isFetchingProfile;
    if (isReady) SplashScreen.hideAsync();
  }, [loaded, authLoading, isFetchingProfile, onboardingLoading]);

  if (!loaded || authLoading || onboardingLoading) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.canvas } }}>
        {/* <Stack.Screen name="(dev)/generate-thumnails" /> */}
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated && hasOnboarded}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated && !hasOnboarded}>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ErrorBoundary>
  );
};
