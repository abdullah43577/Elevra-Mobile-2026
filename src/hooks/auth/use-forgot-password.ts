import { useSubmitData } from "../use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { router } from "expo-router";
import { useRef } from "react";
import { ForgotPasswordFormValues } from "@/schemas/auth/forgot-password";

export const useForgotPassword = function () {
  const emailRef = useRef("");

  const { mutate, isPending } = useSubmitData<
    ForgotPasswordFormValues,
    { message: string }
  >({
    url: API_ENDPOINTS.auth.forgotPassword,
    method: "post",
    getBody: (data) => {
      emailRef.current = data.email;
      return data;
    },
    onSuccessMessage: "Reset code sent to your email",
    onSuccess: () => {
      router.push({
        pathname: "/(auth)/reset-password",
        params: { email: emailRef.current },
      });
    },
  });
  return { mutate, isPending };
};
