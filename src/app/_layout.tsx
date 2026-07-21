import "@/global.css";
import * as SplashScreen from "expo-splash-screen";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/provider/toast-config";
import { AppNavigator } from "@/components/shared/app-navigator";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 3000, fade: true });

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
