import { registerForPushNotificationsAsync } from "@/provider/register-for-push-notification";
import { useAuthStore } from "@/store/auth";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";

/*
  Reads the current push permission and, separately, asks for it.

  The two are deliberately different calls: reading must never raise the OS
  dialog, because the setup checklist and the setup step both need to know
  whether to offer the ask, and a check that silently prompts would fire the
  dialog just by rendering Home.
*/
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
