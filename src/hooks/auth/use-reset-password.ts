import { useSubmitData } from "../use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { router } from "expo-router";
import { ResetPasswordFormValues } from "@/schemas/auth/reset-password";

export const useResetPassword = function () {
  const { mutate, isPending } = useSubmitData<ResetPasswordFormValues, any>({
    url: API_ENDPOINTS.auth.resetPassword,
    method: "post",
    onSuccessMessage: "Password reset successful",
    onSuccess: () => {
      router.replace("/(auth)/sign-in");
    },
  });

  return { mutate, isPending };
};
