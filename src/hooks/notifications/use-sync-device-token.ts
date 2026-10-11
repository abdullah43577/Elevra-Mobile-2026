import { useGetProfile } from "@/hooks/use-get-profile";
import { useRegisterDevice } from "@/hooks/notifications/use-register-device";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

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
