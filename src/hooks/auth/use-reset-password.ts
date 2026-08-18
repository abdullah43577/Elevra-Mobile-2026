import { API_ENDPOINTS } from "@/provider/endpoints";
import { ResetPasswordFormValues } from "@/schemas/auth/reset-password";
import { router } from "expo-router";
import { useSubmitData } from "../use-submit-data";

interface UseResetPasswordOptions {
  email: string;
}

export const useResetPassword = function ({ email }: UseResetPasswordOptions) {
  const { mutate, isPending } = useSubmitData<ResetPasswordFormValues, any>({
    url: API_ENDPOINTS.auth.resetPassword,
    method: "post",
    // confirmPassword is a client-side concern; the server only needs the
    // account, the code, and the new password.
    getBody: (data) => ({ email, otp: data.otp, password: data.password }),
    onSuccessMessage: "Password reset successful",
    onSuccess: () => {
      router.replace("/(auth)/sign-in");
    },
  });

  return { mutate, isPending };
};
