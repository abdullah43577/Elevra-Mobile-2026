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

  console.log(expoPushToken, "expo push token");

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
      <StatusBar style="dark" />

      <Stack screenOptions={{ contentStyle: { backgroundColor: "#ffffff" } }}>
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
