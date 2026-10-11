import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { SubscriptionState } from "../../../types/subscription";
import { useSubmitData } from "../use-submit-data";

interface UseSyncSubscriptionOptions {
  onSuccess?: (data: APIResponse<SubscriptionState>) => void;
}

// No body on purpose: a client claiming what it bought is untrusted; the server pulls it.
export const useSyncSubscription = function (
  options: UseSyncSubscriptionOptions = {},
) {
  const { mutateAsync, isPending } = useSubmitData<
    void,
    APIResponse<SubscriptionState>
  >({
    url: API_ENDPOINTS.subscriptions.sync,
    method: "post",
    silent: true,
    // Silent on failure: this runs on every launch, offline included.
    onError: () => undefined,
    additionalQueryKeys: [
      [API_ENDPOINTS.auth.getProfile],
      [API_ENDPOINTS.subscriptions.detail],
    ],
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { syncSubscription: mutateAsync, isSyncingSubscription: isPending };
};
