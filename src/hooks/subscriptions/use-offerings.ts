import { getCurrentOffering, isPurchasesAvailable } from "@/provider/purchases";
import { useCallback, useEffect, useState } from "react";
import type { PurchasesPackage } from "react-native-purchases";

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
