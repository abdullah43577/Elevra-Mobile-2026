import { API_ENDPOINTS } from "@/provider/endpoints";
import { User } from "../../types/auth";
import { APIResponse } from "../../types/response";
import { useGetData } from "./use-get-data";
import { tokenStorage } from "@/provider/token-storage";
import { useEffect, useState } from "react";

export const useGetProfile = function () {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    tokenStorage.getRefreshToken().then((token) => setHasToken(!!token));
  }, []);

  const { data, isFetching, error, refetch } = useGetData<APIResponse<User>>({
    url: API_ENDPOINTS.auth.getProfile,
    shouldFetch: !!hasToken,
  });

  // Clears tokens and flips hasToken -> false, which drops `profile` to
  // undefined and lets AppNavigator's isAuthenticated guard redirect
  const logout = async function () {
    await tokenStorage.clearTokens();
    setHasToken(false);
  };

  return {
    profile: data?.data,
    isFetchingProfile: hasToken === null || isFetching,
    errorProfile: error,
    refetch,
    logout,
  };
};
