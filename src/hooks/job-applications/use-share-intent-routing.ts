import { shareIntentInput } from "@/provider/share-intent";
import { useRootNavigationState, useRouter } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect } from "react";

// Waits for sign-in and for the root navigator to mount: expo-router throws on a push before that.
export const useShareIntentRouting = function (isAuthenticated: boolean) {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();

  useEffect(() => {
    if (!hasShareIntent || !isAuthenticated || !navigationState?.key) return;

    const shared = shareIntentInput(shareIntent);
    resetShareIntent();
    if (!shared) return;

    router.push({
      pathname: "/(dashboard)/(tabs)/applications/application-form",
      params: { shared },
    });
  }, [hasShareIntent, isAuthenticated, navigationState?.key, shareIntent, resetShareIntent, router]);
};
