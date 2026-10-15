import * as Updates from "expo-updates";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

const RECHECK_INTERVAL_MS = 15 * 60 * 1000;

// The launch check is expo-updates' own (checkAutomatically: ON_LOAD); this adds
// one on return to the foreground, since a phone can go days without a cold start.
export const useOtaUpdate = function () {
  const { isUpdatePending, downloadedUpdate } = Updates.useUpdates();
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const lastCheckedAt = useRef(Date.now());

  useEffect(() => {
    if (!Updates.isEnabled) return;

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      if (Date.now() - lastCheckedAt.current < RECHECK_INTERVAL_MS) return;
      lastCheckedAt.current = Date.now();

      Updates.checkForUpdateAsync()
        .then((result) => (result.isAvailable ? Updates.fetchUpdateAsync() : null))
        .catch(() => {});
    });

    return () => subscription.remove();
  }, []);

  const updateId = downloadedUpdate?.updateId ?? null;

  const restartToUpdate = async function () {
    setIsRestarting(true);
    try {
      await Updates.reloadAsync();
    } catch {
      setIsRestarting(false);
    }
  };

  // A dismissed update still applies on the next cold start.
  const dismissUpdate = function () {
    setDismissedId(updateId);
  };

  return {
    isUpdateReady: Updates.isEnabled && isUpdatePending && updateId !== dismissedId,
    isRestarting,
    restartToUpdate,
    dismissUpdate,
  };
};
