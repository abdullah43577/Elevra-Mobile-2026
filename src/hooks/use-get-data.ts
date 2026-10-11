import api, { CustomAxiosRequestConfig } from "@/provider/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useEffect } from "react";

interface Props {
  url: string;
  skipAuth?: boolean;
  shouldFetch?: boolean;
  queryKey?: string;
}

interface UseGetDataResult<T> {
  isFetching: boolean;
  data: T | undefined;
  refetch: () => void;
  error: Error | null;
}

export const useGetData = function <T>({
  url,
  skipAuth,
  shouldFetch,
  queryKey,
}: Props): UseGetDataResult<T> {
  const queryFn = useCallback(async () => {
    try {
      const response = await api.get(url, {
        skipAuth,
      } as CustomAxiosRequestConfig);
      return response.data;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "An error occurred");
      } else {
        throw new Error(error.message || "An expected error occurred");
      }
    }
  }, [url, skipAuth]);

  const { isFetching, error, data, refetch } = useQuery({
    queryKey: [url],
    queryFn,
    // gcTime must not be set here: a short value evicts the restored offline cache.
    // staleTime, gcTime and retry come from src/utils/queryClient.ts.
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: shouldFetch,
  });

  useEffect(() => {
    if (error) console.log("errors", error);
  }, [error]);

  return { isFetching, data, refetch, error };
};
