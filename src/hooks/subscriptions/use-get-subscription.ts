import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { SubscriptionState } from "../../../types/subscription";
import { useGetData } from "../use-get-data";

interface UseGetSubscriptionOptions {
  shouldFetch?: boolean;
}

export const useGetSubscription = function (
  options: UseGetSubscriptionOptions = {},
) {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<SubscriptionState>
  >({
    url: API_ENDPOINTS.subscriptions.detail,
    shouldFetch: options.shouldFetch ?? true,
  });

  return {
    subscription: data?.data,
    isFetchingSubscription: isFetching,
    errorSubscription: error,
    refetchSubscription: refetch,
  };
};
