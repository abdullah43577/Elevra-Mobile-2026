import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { AppState } from "react-native";
import { useAuthStore } from "@/store/auth";
import { registerForPushNotificationsAsync } from "@/provider/register-for-push-notification";
import { NOTIFICATION_ROUTES } from "@/constants/notifications";
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

  //* Dismiss all notifications
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

  const handleRegisterForPushNotification = async function () {
    try {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token ?? "");
    } catch (error) {
      setExpoPushTokenError(`${error}`);
      // handleErrors(error);
    }
  };

  useEffect(() => {
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
        // The server puts entityType/entityId in the push payload so a tap can
        // open the thing the notification is actually about.
        const data = response.notification.request.content.data as {
          entityType?: NotificationEntity;
          entityId?: string;
        };

        const route = data?.entityType && NOTIFICATION_ROUTES[data.entityType];
        if (route && data.entityId) {
          router.push({
            pathname: route as any,
            params: { id: data.entityId },
          });
        }
      });

    return () => {
      (notificationListener.current && notificationListener.current.remove(),
        responseListener.current && responseListener.current.remove());
      //   notificationListener.current &&
      //     Notifications.removeNotificationSubscription(
      //       notificationListener.current,
      //     );
      //   responseListener.current &&
      //     Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return {
    expoPushToken,
    expoPushTokenError,
    notification,
    handleRegisterForPushNotification,
  };
}
