import { API_ENDPOINTS } from "@/provider/endpoints";
import { AppNotification } from "../../../types/notification";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

interface UseGetNotificationsOptions {
  isRead?: boolean;
}

export const useGetNotifications = function (
  options?: UseGetNotificationsOptions,
) {
  const { isRead } = options || {};

  const url =
    isRead === undefined
      ? API_ENDPOINTS.notifications.list
      : `${API_ENDPOINTS.notifications.list}?isRead=${isRead}`;

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<AppNotification[]>
  >({ url });

  return {
    notifications: data?.data || [],
    isFetchingNotifications: isFetching,
    errorNotifications: error,
    refetchNotifications: refetch,
  };
};
