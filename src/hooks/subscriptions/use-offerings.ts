import { getCurrentOffering, isPurchasesAvailable } from "@/provider/purchases";
import { useCallback, useEffect, useState } from "react";
import type { PurchasesPackage } from "react-native-purchases";

/*
  Offerings come from the RevenueCat SDK, not from our API, so this is plain
  state rather than a useGetData adapter — there is no url to key a query on and
  nothing to persist offline. A paywall with no connection has nothing to sell.
*/
export const useOfferings = function () {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isPurchasesAvailable()) {
      setError("Purchases are not available on this build");
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      const offering = await getCurrentOffering();

      if (!offering) {
        // Reached RevenueCat but there is no current offering configured — a
        // dashboard problem, not a network one, and worth saying differently.
        setError("No subscription plans are available right now");
        setPackages([]);
        return;
      }

      setPackages(offering.availablePackages);
    } catch {
      setError("Could not load subscription plans");
      setPackages([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    packages,
    isFetchingOfferings: isFetching,
    errorOfferings: error,
    refetchOfferings: load,
  };
};
