import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRef } from "react";
import { useHandleErrors } from "./use-handle-errors";
import api, { CustomAxiosRequestConfig } from "@/provider/api";
import { queryClient } from "@/utils/queryClient";
import { router } from "expo-router";
import { showToast } from "@/utils/show-toast";

interface UseSubmitDataOptions<TData, TResponse> {
  url: string | ((data: TData) => string);
  getBody?: (data: TData) => unknown;
  method?: "post" | "put" | "patch" | "delete";
  additionalQueryKeys?: string[][];
  onSuccessMessage?: string;
  onLoadingMessage?: string;
  onError?: (error: AxiosError<{ message?: string }>) => void;
  onSuccess?: (data: TResponse) => void;
  redirectTo?: string;
  skipAuth?: boolean;
}

export function useSubmitData<TData = unknown, TResponse = unknown>(
  options: UseSubmitDataOptions<TData, TResponse>,
) {
  const {
    url,
    getBody,
    method = "post",
    additionalQueryKeys,
    onSuccessMessage = "Operation successful",
    onLoadingMessage,
    onError,
    onSuccess,
    redirectTo,
    skipAuth,
  } = options;

  const handleErrors = useHandleErrors();
  const lastResolvedUrl = useRef<string>("");

  const mutation = useMutation<
    TResponse,
    AxiosError<{ message?: string }>,
    TData
  >({
    mutationFn: async (data: TData) => {
      if (onLoadingMessage) showToast("loading", onLoadingMessage);

      const resolvedUrl = typeof url === "function" ? url(data) : url;
      lastResolvedUrl.current = resolvedUrl;

      const body = getBody ? getBody(data) : data;

      const config: Partial<CustomAxiosRequestConfig> = {};
      if (skipAuth) config.skipAuth = true;

      const response = await api[method]<TResponse>(resolvedUrl, body, config);

      return response.data;
    },

    onSuccess: (data) => {
      showToast("success", onSuccessMessage);

      queryClient.refetchQueries({ queryKey: [lastResolvedUrl.current] });

      additionalQueryKeys?.forEach((key) => {
        queryClient.refetchQueries({ queryKey: key });
      });

      onSuccess?.(data);

      if (redirectTo) {
        router.push(redirectTo as any);
      }
    },

    onError: (error) => {
      if (onError) {
        onError(error);
      } else {
        handleErrors(error);
      }
    },
  });

  return mutation;
}
