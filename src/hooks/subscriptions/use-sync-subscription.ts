import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { SubscriptionState } from "../../../types/subscription";
import { useSubmitData } from "../use-submit-data";

interface UseSyncSubscriptionOptions {
  onSuccess?: (data: APIResponse<SubscriptionState>) => void;
}

/*
  Asks the server to pull the entitlement from RevenueCat. It carries no body on
  purpose — the client never reports what it bought, because a client claiming
  "I am pro" is untrusted input. It can only ask us to go and look.

  Silent: it runs after a purchase (which has its own success message) and on
  sign-in, neither of which wants a toast of its own.
*/
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
    /*
      Silenced on failure too. This runs on every launch, so the default error
      toast would greet anyone who opens the app offline with a message about a
      subscription they were not thinking about. The server already refuses to
      downgrade on a failed pull, so a failure here changes nothing.
    */
    onError: () => undefined,
    // The tier every gate reads comes back on the profile, and the subscription
    // screen reads the detail endpoint. Neither is the mutation's own key.
    additionalQueryKeys: [
      [API_ENDPOINTS.auth.getProfile],
      [API_ENDPOINTS.subscriptions.detail],
    ],
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { syncSubscription: mutateAsync, isSyncingSubscription: isPending };
};
