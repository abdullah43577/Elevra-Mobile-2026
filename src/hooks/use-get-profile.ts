import { API_ENDPOINTS } from "@/provider/endpoints";
import { User } from "../../types/auth";
import { APIResponse } from "../../types/response";
import { useGetData } from "./use-get-data";
import { tokenStorage } from "@/provider/token-storage";
import { useAuthStore } from "@/store/auth";

export const useGetProfile = function () {
  const { hasToken, setAuthenticated } = useAuthStore();

  const { data, isFetching, error, refetch } = useGetData<APIResponse<User>>({
    url: API_ENDPOINTS.auth.getProfile,
    shouldFetch: !!hasToken,
  });

  const logout = async function () {
    await tokenStorage.clearTokens();
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
