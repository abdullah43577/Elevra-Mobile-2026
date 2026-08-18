import { AppText } from "@/components/shared/app-text";
import { formatRelativeDate } from "@/constants/dashboard";
import { NOTIFICATION_META } from "@/constants/notifications";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import {
  AppNotification,
  NotificationType,
} from "../../../types/notification";

interface Props {
  notification: AppNotification;
  onPress: () => void;
  onDelete: () => void;
}

export const NotificationRow = function ({
  notification,
  onPress,
  onDelete,
}: Props) {
  const { foregroundSubtle } = useThemeColors();

  const meta =
    NOTIFICATION_META[notification.type as NotificationType] ??
    NOTIFICATION_META.SYSTEM;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-start gap-3 px-4 py-3.5 active:bg-surface-muted"
    >
      <View
        className="items-center justify-center rounded-squircle"
        style={{ width: 38, height: 38, backgroundColor: `${meta.color}1F` }}
      >
        <Ionicons name={meta.icon} size={18} color={meta.color} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <AppText
            type="label"
            numberOfLines={1}
            className={notification.isRead ? "flex-1 opacity-70" : "flex-1"}
          >
            {notification.title}
          </AppText>

          {!notification.isRead && (
            <View
              className="rounded-full"
              style={{ width: 7, height: 7, backgroundColor: meta.color }}
            />
          )}
        </View>

        <AppText type="subtitle" numberOfLines={2} className="mt-0.5">
          {notification.body}
        </AppText>

        <AppText type="caption" className="mt-1">
          {formatRelativeDate(notification.createdAt)}
        </AppText>
      </View>

      <Pressable
        onPress={onDelete}
        hitSlop={10}
        className="h-8 w-8 items-center justify-center rounded-full active:bg-surface-muted"
      >
        <Ionicons name="close" size={15} color={foregroundSubtle} />
      </Pressable>
    </Pressable>
  );
};
