import { purchasePackage, restorePurchases } from "@/provider/purchases";
import { showToast } from "@/utils/show-toast";
import { useState } from "react";
import type { PurchasesPackage } from "react-native-purchases";
import { useSyncSubscription } from "./use-sync-subscription";

interface UsePurchaseProOptions {
  onEntitled?: () => void;
}

/*
  Buying and restoring, both of which end the same way: ask the server to pull
  the entitlement from RevenueCat.

  The SDK's own customerInfo is deliberately ignored as an authority. It is
  correct, but it reaches us through the client, and the whole point of the
  server pull is that entitlement is derived somewhere the user cannot reach.
*/
export const usePurchasePro = function (options: UsePurchaseProOptions = {}) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { syncSubscription } = useSyncSubscription();

  const purchase = async function (pack: PurchasesPackage) {
    setIsPurchasing(true);

    try {
      const { cancelled } = await purchasePackage(pack);

      // Closing the sheet is an ordinary outcome, not a failure. No toast.
      if (cancelled) return false;

      /*
        The purchase has already gone through by this point — money has moved.
        A failed sync must therefore never be reported as a failed purchase,
        which is what letting it reach the catch below would do. The entitlement
        is safe either way: it lives in RevenueCat, and the next launch pulls it.
      */
      try {
        await syncSubscription();
        showToast("success", "You are on Pro");
      } catch {
        showToast(
          "success",
          "Purchase complete. Your Pro access will appear in a moment.",
        );
      }

      options.onEntitled?.();
      return true;
    } catch (error) {
      showToast(
        "error",
        (error as Error)?.message || "That purchase could not be completed",
      );
      return false;
    } finally {
      setIsPurchasing(false);
    }
  };

  const restore = async function () {
    setIsRestoring(true);

    try {
      await restorePurchases();

      /*
        The sync decides whether anything was actually restored. Reading the
        SDK's customerInfo here would mean two different answers to "is this
        user Pro" — the client's and the server's — and only one of them is the
        one the gates obey.
      */
      const response = await syncSubscription();

      if (response.data.isActive) {
        showToast("success", "Your subscription has been restored");
        options.onEntitled?.();
        return true;
      }

      showToast("warning", "No previous purchase was found for this account");
      return false;
    } catch {
      showToast("error", "Could not restore purchases");
      return false;
    } finally {
      setIsRestoring(false);
    }
  };

  return { purchase, restore, isPurchasing, isRestoring };
};
