import { useSubmitData } from "../use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { router } from "expo-router";
import { ForgotPasswordFormValues } from "@/schemas/auth/forgot-password";

export const useForgotPassword = function () {
  const { mutate, isPending } = useSubmitData<
    ForgotPasswordFormValues,
    { message: string }
  >({
    url: API_ENDPOINTS.auth.forgotPassword,
    method: "post",
    onSuccessMessage: "Reset code sent to your email",
    onSuccess: () => {
      router.push("/(auth)/reset-password");
    },
  });
  return { mutate, isPending };
};
