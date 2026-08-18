import { API_ENDPOINTS } from "@/provider/endpoints";
import { User } from "../../types/auth";
import { APIResponse } from "../../types/response";
import { useGetData } from "./use-get-data";
import { tokenStorage } from "@/provider/token-storage";
import { useAuthStore } from "@/store/auth";
import { clearPersistedCache } from "@/provider/query-persister";
import { queryClient } from "@/utils/queryClient";

export const useGetProfile = function () {
  const { hasToken, setAuthenticated } = useAuthStore();

  const { data, isFetching, error, refetch } = useGetData<APIResponse<User>>({
    url: API_ENDPOINTS.auth.getProfile,
    shouldFetch: !!hasToken,
  });

  const logout = async function () {
    await tokenStorage.clearTokens();

    // The persisted cache is per-device, not per-account. Leaving it behind
    // would show the next person to sign in on this device the previous user's
    // notes, applications, and profile until the first refetch lands.
    queryClient.clear();
    await clearPersistedCache();

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
