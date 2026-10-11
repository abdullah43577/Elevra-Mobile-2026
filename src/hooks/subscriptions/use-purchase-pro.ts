import { purchasePackage, restorePurchases } from "@/provider/purchases";
import { showToast } from "@/utils/show-toast";
import { useState } from "react";
import type { PurchasesPackage } from "react-native-purchases";
import { useSyncSubscription } from "./use-sync-subscription";

interface UsePurchaseProOptions {
  onEntitled?: () => void;
}

export const usePurchasePro = function (options: UsePurchaseProOptions = {}) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { syncSubscription } = useSyncSubscription();

  const purchase = async function (pack: PurchasesPackage) {
    setIsPurchasing(true);

    try {
      const { cancelled } = await purchasePackage(pack);

      if (cancelled) return false;

      // Money has moved by now; a failed sync must never read as a failed purchase.
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

      // The server sync is the authority; the SDK's customerInfo is deliberately ignored.
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
