import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

/*
  A blip is not an outage. Locking the phone powers the radio down on both
  platforms, so expo-network reports a disconnect within a second or two and
  reports it back on unlock — which surfaced as the offline banner appearing on
  every single unlock and clearing itself moments later.

  Going offline is therefore delayed by this grace period; coming back online is
  applied immediately. A request fired inside the window fails and retries
  rather than pausing, which is the cheaper of the two wrong answers: the
  alternative is a banner that cries wolf every time the screen wakes.
*/
const OFFLINE_GRACE_MS = 3000;

const isReachable = function (state: Network.NetworkState) {
  return !!state.isConnected && state.isInternetReachable !== false;
};

/*
  React Query cannot detect connectivity on its own in React Native — without
  this, onlineManager always reports "online" and offline requests fail instead
  of pausing. Wiring it up is what makes queries serve cache and mutations queue
  rather than error.

  Registered once from the root layout.
*/
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

      /*
        The listener can miss transitions that happen while the app is
        backgrounded, so returning to the foreground re-reads the real state
        rather than trusting whatever the last event left behind.
      */
      const appState = AppState.addEventListener("change", (next) => {
        if (next === "active") read();
      });

      // Seed the initial value; the listener only fires on change.
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
