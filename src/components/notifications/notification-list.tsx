import { View } from "react-native";
import { AppNotification } from "../../../types/notification";
import { NotificationRow } from "./notification-row";

interface Props {
  notifications: AppNotification[];
  onPressNotification: (notification: AppNotification) => void;
  onDeleteNotification: (id: string) => void;
}

export const NotificationList = function ({
  notifications,
  onPressNotification,
  onDeleteNotification,
}: Props) {
  return (
    <View className="overflow-hidden rounded-2xl border-hairline border-line bg-surface">
      {notifications.map((notification, index) => (
        <View key={notification.id}>
          {index > 0 && <View className="ml-16 h-px bg-line" />}
          <NotificationRow
            notification={notification}
            onPress={() => onPressNotification(notification)}
            onDelete={() => onDeleteNotification(notification.id)}
          />
        </View>
      ))}
    </View>
  );
};
