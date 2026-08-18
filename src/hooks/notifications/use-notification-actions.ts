import { API_ENDPOINTS } from "@/provider/endpoints";
import { AppNotification } from "../../../types/notification";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

// Both the list and the badge count are separate queries, so every mutation
// has to refetch them explicitly.
const NOTIFICATION_KEYS = [
  [API_ENDPOINTS.notifications.list],
  [API_ENDPOINTS.notifications.unreadCount],
];

export const useNotificationActions = function () {
  const { mutate: markRead } = useSubmitData<
    { id: string },
    APIResponse<AppNotification>
  >({
    url: ({ id }) => API_ENDPOINTS.notifications.markRead(id),
    getBody: () => undefined,
    method: "post",
    silent: true,
    additionalQueryKeys: NOTIFICATION_KEYS,
  });

  const { mutate: markAllRead, isPending: isMarkingAllRead } = useSubmitData<
    void,
    APIResponse<{ updated: number }>
  >({
    url: API_ENDPOINTS.notifications.markAllRead,
    method: "post",
    silent: true,
    additionalQueryKeys: NOTIFICATION_KEYS,
  });

  const { mutate: deleteNotification } = useSubmitData<
    { id: string },
    APIResponse<null>
  >({
    url: ({ id }) => API_ENDPOINTS.notifications.delete(id),
    getBody: () => undefined,
    method: "delete",
    silent: true,
    additionalQueryKeys: NOTIFICATION_KEYS,
  });

  const { mutate: clearAll, isPending: isClearing } = useSubmitData<
    void,
    APIResponse<{ deleted: number }>
  >({
    url: API_ENDPOINTS.notifications.clearAll,
    method: "delete",
    onSuccessMessage: "Notifications cleared",
    additionalQueryKeys: NOTIFICATION_KEYS,
  });

  return {
    markRead,
    markAllRead,
    deleteNotification,
    clearAll,
    isMarkingAllRead,
    isClearing,
  };
};
