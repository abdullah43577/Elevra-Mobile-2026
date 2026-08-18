import "@/global.css";
import { AppNavigator } from "@/components/shared/app-navigator";
import { OfflineBanner } from "@/components/shared/offline-banner";
import { useOnlineManager } from "@/hooks/use-online-status";
import { CACHE_BUSTER, queryPersister } from "@/provider/query-persister";
import { toastConfig } from "@/provider/toast-config";
import { queryClient } from "@/utils/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 3000, fade: true });

export default function RootLayout() {
  useOnlineManager();

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: queryPersister,
          maxAge: 1000 * 60 * 60 * 24, // discard anything older than a day
          buster: CACHE_BUSTER,
          dehydrateOptions: {
            // Persisting a failed query would restore an error state on next
            // launch and show a broken screen instead of simply refetching.
            shouldDehydrateQuery: (query) => query.state.status === "success",

            /*
            Paused mutations are deliberately NOT persisted. useSubmitData
            builds its mutationFn inline with no mutationKey, and a function
            cannot be serialised — so a restored mutation would have nothing to
            run and would sit paused forever.

            Offline writes still pause and resume within a session (React Query
            replays them via onlineManager on reconnect). What is not supported
            is a write surviving a full app restart while still offline; that
            needs mutationKey + setMutationDefaults across useSubmitData.
          */
            shouldDehydrateMutation: () => false,
          },
        }}
        onSuccess={() => queryClient.resumePausedMutations()}
      >
        <AppNavigator />
        <OfflineBanner />
        <Toast config={toastConfig} />
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
