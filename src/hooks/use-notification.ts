import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { AppState } from "react-native";
import { useAuthStore } from "@/store/auth";
import { registerForPushNotificationsAsync } from "@/provider/register-for-push-notification";
import { notificationTarget } from "@/constants/notifications";
import { NotificationEntity } from "../../types/notification";
import { router } from "expo-router";

export default function useNotifications() {
  const { expoPushToken, setExpoPushToken } = useAuthStore();
  const [expoPushTokenError, setExpoPushTokenError] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const appStateRef = useRef(AppState.currentState);

  Notifications.setNotificationHandler({
    handleNotification: async () => {
      const isAppActive = appStateRef.current === "active";

      return {
        shouldShowAlert: isAppActive,
        shouldPlaySound: isAppActive,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      };
    },
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appStateRef.current = nextAppState;

      if (nextAppState === "active") {
        Notifications.getAllScheduledNotificationsAsync().then((notifs) => {
          if (notifs.length) Notifications.dismissAllNotificationsAsync();
        });
      }
    });

    return () => subscription.remove();
  }, []);

  const handleRegisterForPushNotification = async function (
    promptIfNeeded = false,
  ) {
    try {
      const token = await registerForPushNotificationsAsync({ promptIfNeeded });
      setExpoPushToken(token ?? "");
      return !!token;
    } catch (error) {
      setExpoPushTokenError(`${error}`);
      return false;
    }
  };

  useEffect(() => {
    // Never prompts here; the ask belongs to the setup flow.
    handleRegisterForPushNotification();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "🛎️ Notification Received while the app is running: ",
          notification,
        );
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as {
          type?: string;
          entityType?: NotificationEntity;
          entityId?: string;
        };

        const target = data && notificationTarget(data);
        if (target) router.push(target);
      });

    return () => {
      (notificationListener.current && notificationListener.current.remove(),
        responseListener.current && responseListener.current.remove());
    };
  }, []);

  return {
    expoPushToken,
    expoPushTokenError,
    notification,
    handleRegisterForPushNotification,
  };
}
