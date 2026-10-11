import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

// Going offline waits out a grace period: locking the phone drops the radio for a
// second or two, which would flash the offline banner on every unlock.
const OFFLINE_GRACE_MS = 3000;

const isReachable = function (state: Network.NetworkState) {
  return !!state.isConnected && state.isInternetReachable !== false;
};

// React Query cannot detect connectivity in React Native; without this it always reports online.
export const useOnlineManager = function () {
  useEffect(() => {
    return onlineManager.setEventListener((setOnline) => {
      let pending: ReturnType<typeof setTimeout> | null = null;

      const cancelPending = function () {
        if (!pending) return;
        clearTimeout(pending);
        pending = null;
      };

      const apply = function (online: boolean) {
        cancelPending();
        if (online) return setOnline(true);
        pending = setTimeout(() => setOnline(false), OFFLINE_GRACE_MS);
      };

      const read = function () {
        Network.getNetworkStateAsync()
          .then((state) => apply(isReachable(state)))
          .catch(() => apply(true));
      };

      const subscription = Network.addNetworkStateListener((state) =>
        apply(isReachable(state)),
      );

      // The listener can miss transitions while backgrounded, so re-read on foreground.
      const appState = AppState.addEventListener("change", (next) => {
        if (next === "active") read();
      });

      // The listener only fires on change.
      read();

      return () => {
        cancelPending();
        subscription.remove();
        appState.remove();
      };
    });
  }, []);
};

export const useIsOnline = function () {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => onlineManager.subscribe(setIsOnline), []);

  return isOnline;
};
