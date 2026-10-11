import { identifyPurchaser } from "@/provider/purchases";
import { useEffect, useRef } from "react";
import { useSyncSubscription } from "./use-sync-subscription";

// Identify first: the server looks the RevenueCat customer up by our user id.
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
        // The server never downgrades on an unreachable pull.
      }
    })();
  }, [userId, syncSubscription]);
};
