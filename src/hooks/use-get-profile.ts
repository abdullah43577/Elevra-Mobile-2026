import { API_ENDPOINTS } from "@/provider/endpoints";
import { User } from "../../types/auth";
import { APIResponse } from "../../types/response";
import { useGetData } from "./use-get-data";
import { tokenStorage } from "@/provider/token-storage";
import { useAuthStore } from "@/store/auth";
import { clearPersistedCache } from "@/provider/query-persister";
import { forgetPurchaser } from "@/provider/purchases";
import { forgetSocialSession } from "@/provider/social-auth";
import { queryClient } from "@/utils/queryClient";

export const useGetProfile = function () {
  const { hasToken, setAuthenticated } = useAuthStore();

  const { data, isFetching, error, refetch } = useGetData<APIResponse<User>>({
    url: API_ENDPOINTS.auth.getProfile,
    shouldFetch: !!hasToken,
  });

  const logout = async function () {
    await tokenStorage.clearTokens();

    // The persisted cache is per-device, not per-account.
    queryClient.clear();
    await clearPersistedCache();

    // Otherwise the next account on this device inherits this RevenueCat entitlement.
    await forgetPurchaser();

    // Google caches the account natively; otherwise the next sign-in skips the chooser.
    await forgetSocialSession();

    setAuthenticated(false);
  };

  return {
    profile: data?.data,
    isFetchingProfile: isFetching,
    errorProfile: error,
    refetch,
    logout,
  };
};
