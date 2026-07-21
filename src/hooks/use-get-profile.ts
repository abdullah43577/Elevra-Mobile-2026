import { API_ENDPOINTS } from "@/provider/endpoints";
import { User } from "../../types/auth";
import { APIResponse } from "../../types/response";
import { useGetData } from "./use-get-data";
import { useEffect } from "react";

export const useGetProfile = function () {
  const { data, isFetching, error, refetch } = useGetData<APIResponse<User>>({
    url: API_ENDPOINTS.auth.getProfile,
  });

  //   useEffect(() => {
  //     if (data?.data?.role === "COMPANY" && data?.data.subscription_tier) {
  //       setPlanCookie(data?.data.subscription_tier);
  //     }
  //   }, [data?.data?.subscription_tier, data?.data?.role]);

  return {
    profile: data?.data,
    isFetchingProfile: isFetching,
    errorProfile: error,
    refetch,
  };
};
