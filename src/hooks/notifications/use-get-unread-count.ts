import { API_ENDPOINTS } from "@/provider/endpoints";
import { UnreadCount } from "../../../types/notification";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

export const useGetUnreadCount = function () {
  const { data, isFetching, refetch } = useGetData<APIResponse<UnreadCount>>({
    url: API_ENDPOINTS.notifications.unreadCount,
  });

  return {
    unreadCount: data?.data?.count ?? 0,
    isFetchingUnreadCount: isFetching,
    refetchUnreadCount: refetch,
  };
};
