import { useSubmitData } from "../use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { router } from "expo-router";
import { VerifyEmailFormValues } from "@/schemas/auth/verify-email";
import { APIResponse } from "../../../types/response";

export const useVerifyEmail = function () {
  const { mutate, isPending } = useSubmitData<
    VerifyEmailFormValues,
    APIResponse<null>
  >({
    url: API_ENDPOINTS.auth.verifyEmail,
    method: "post",
    onSuccessMessage: "Email verified successfully",
    onSuccess: () => router.replace("/(auth)/sign-in"),
  });

  return { mutate, isPending };
};
