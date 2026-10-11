import { registerForPushNotificationsAsync } from "@/provider/register-for-push-notification";
import { useAuthStore } from "@/store/auth";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";

// Reading must never raise the OS dialog, or rendering Home would prompt.
export const usePushPermission = function () {
  const [isGranted, setIsGranted] = useState<boolean | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const setExpoPushToken = useAuthStore((state) => state.setExpoPushToken);

  const refresh = useCallback(async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setIsGranted(status === "granted");
    } catch {
      setIsGranted(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const requestPermission = useCallback(async () => {
    setIsRequesting(true);

    try {
      const token = await registerForPushNotificationsAsync({
        promptIfNeeded: true,
      });

      if (token) setExpoPushToken(token);

      const granted = !!token;
      setIsGranted(granted);
      return granted;
    } catch {
      setIsGranted(false);
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, [setExpoPushToken]);

  return { isGranted, isRequesting, requestPermission, refreshPermission: refresh };
};
