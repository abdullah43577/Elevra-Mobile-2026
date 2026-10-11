import { SignInFormValues } from "@/schemas/auth/sign-in";
import { useSubmitData } from "../use-submit-data";
import { APIResponse } from "../../../types/response";
import { AuthSession } from "../../../types/auth";
import { AUTH_ERROR_CODES } from "@/constants/auth";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { tokenStorage } from "@/provider/token-storage";
import { router } from "expo-router";
import { useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { useHandleErrors } from "../use-handle-errors";
import { showToast } from "@/utils/show-toast";

export const useLogin = function () {
  const { setAuthenticated } = useAuthStore();
  const handleErrors = useHandleErrors();

  const emailRef = useRef("");

  const { mutate, isPending } = useSubmitData<
    SignInFormValues,
    APIResponse<AuthSession>
  >({
    url: API_ENDPOINTS.auth.signin,
    method: "post",
    getBody: (data) => {
      emailRef.current = data.email;
      return data;
    },
    onSuccessMessage: "Login Successful",
    onSuccess: async (data) => {
      await tokenStorage.setTokens(
        data.data.token.tokens.accessToken,
        data.data.token.tokens.refreshToken,
      );

      setAuthenticated(true);
    },
    onError: (error) => {
      if (
        error.response?.status === 403 &&
        error.response.data?.code === AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED
      ) {
        showToast(
          "warning",
          error.response.data.message ??
            "Please verify your email to continue.",
        );

        router.push({
          pathname: "/(auth)/verify-email",
          params: { email: emailRef.current },
        });

        return;
      }

      handleErrors(error);
    },
  });

  return { login: mutate, isPending };
};
