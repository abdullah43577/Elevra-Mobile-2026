import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useOnboardingStore } from "@/store/onboarding";
import { useGetProfile } from "@/hooks/use-get-profile";
import { useAuthStore } from "@/store/auth";
import { ErrorBoundary } from "./error-boundary";

export const AppNavigator = function () {
  const [loaded] = useFonts({
    "Roboto-Regular": require("../../../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../../../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("../../../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-SemiBold": require("../../../assets/fonts/Roboto-SemiBold.ttf"),
  });
  const {
    hasToken,
    isLoading: authLoading,
    checkAuthStatus,
    expoPushToken,
  } = useAuthStore();
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
