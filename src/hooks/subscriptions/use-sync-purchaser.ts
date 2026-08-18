import { identifyPurchaser } from "@/provider/purchases";
import { useEffect, useRef } from "react";
import { useSyncSubscription } from "./use-sync-subscription";

/*
  Ties the RevenueCat customer to our user id once per signed-in session, then
  pulls the entitlement.

  The identify half is what makes the server's pull possible at all — it looks
  the customer up by our user id, so a purchase made against an anonymous
  RevenueCat customer would be invisible to it.

  The sync half is what catches a lapse. Entitlement is pulled, never pushed, so
  a subscription that expired while the app was closed is corrected here rather
  than by a webhook — which means at worst one launch of stale access.
*/
export const useSyncPurchaser = function (userId?: string) {
  const { syncSubscription } = useSyncSubscription();
  const identifiedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || identifiedFor.current === userId) return;

    identifiedFor.current = userId;

    (async () => {
      await identifyPurchaser(userId);

      try {
        await syncSubscription();
      } catch {
        // A failed sync leaves the stored tier alone by design — the server
        // never downgrades on an unreachable pull.
      }
    })();
  }, [userId, syncSubscription]);
};
