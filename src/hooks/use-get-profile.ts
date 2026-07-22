import { API_ENDPOINTS } from "@/provider/endpoints";
import { User } from "../../types/auth";
import { APIResponse } from "../../types/response";
import { useGetData } from "./use-get-data";
import { tokenStorage } from "@/provider/token-storage";
import { useEffect, useState } from "react";

export const useGetProfile = function () {
  const [hasToken, setHasToken] = useState<boolean | null>(null); // null = "still checking"

  useEffect(() => {
    tokenStorage.getRefreshToken().then((token) => setHasToken(!!token));
  }, []);

  const { data, isFetching, error, refetch } = useGetData<APIResponse<User>>({
    url: API_ENDPOINTS.auth.getProfile,
    shouldFetch: !!hasToken,
  });

  return {
    profile: data?.data,
    isFetchingProfile: hasToken === null || isFetching,
    errorProfile: error,
    refetch,
  };
};
