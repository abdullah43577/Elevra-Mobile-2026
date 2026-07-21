import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useHandleErrors } from "./use-handle-errors";
import api, { CustomAxiosRequestConfig } from "@/provider/api";
import { queryClient } from "@/utils/queryClient";
import { router } from "expo-router";
import { showToast } from "@/utils/show-toast";

interface UseSubmitDataOptions<TData, TResponse> {
  url: string;
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

  const mutation = useMutation<
    TResponse,
    AxiosError<{ message?: string }>,
    TData
  >({
    mutationFn: async (data: TData) => {
      if (onLoadingMessage) showToast("loading", onLoadingMessage);

      const config: Partial<CustomAxiosRequestConfig> = {};
      if (skipAuth) config.skipAuth = true;

      const response = await api[method]<TResponse>(url, data, config);

      return response.data;
    },

    onSuccess: (data) => {
      showToast("success", onSuccessMessage);

      queryClient.refetchQueries({ queryKey: [url] });

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
