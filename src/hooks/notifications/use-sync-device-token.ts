import { useGetProfile } from "@/hooks/use-get-profile";
import { useRegisterDevice } from "@/hooks/notifications/use-register-device";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

/*
  Keeps the server's copy of the Expo push token current.

  The token was previously only sent at sign-up, so signing in on a second
  device — or Expo rotating the token — left the server pushing to an address
  nobody was listening on. This re-registers once per session, and again
  whenever the token itself changes.
*/
export const useSyncDeviceToken = function (expoPushToken?: string | null) {
  const { profile } = useGetProfile();
  const { registerDevice } = useRegisterDevice();

  const lastRegistered = useRef<string | null>(null);

  useEffect(() => {
    if (!expoPushToken || !profile) return;
    if (lastRegistered.current === expoPushToken) return;
    if (profile.deviceToken === expoPushToken) return;

    lastRegistered.current = expoPushToken;
    registerDevice({ deviceToken: expoPushToken, deviceType: Platform.OS });
  }, [expoPushToken, profile]);
};
