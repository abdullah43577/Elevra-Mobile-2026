import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { useEffect, useState } from "react";

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
      const subscription = Network.addNetworkStateListener((state) => {
        setOnline(!!state.isConnected && state.isInternetReachable !== false);
      });

      // Seed the initial value; the listener only fires on change.
      Network.getNetworkStateAsync()
        .then((state) =>
          setOnline(!!state.isConnected && state.isInternetReachable !== false),
        )
        .catch(() => setOnline(true));

      return () => subscription.remove();
    });
  }, []);
};

export const useIsOnline = function () {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  useEffect(() => onlineManager.subscribe(setIsOnline), []);

  return isOnline;
};
