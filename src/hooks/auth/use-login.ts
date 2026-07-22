import { SignInFormValues } from "@/schemas/auth/sign-in";
import { useSubmitData } from "../use-submit-data";
import { APIResponse } from "../../../types/response";
import { User } from "../../../types/auth";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { tokenStorage } from "@/provider/token-storage";
import { router } from "expo-router";

export const useLogin = function () {
  const { mutate, isPending } = useSubmitData<
    SignInFormValues,
    APIResponse<{
      user: User;
      token: {
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
      };
    }>
  >({
    url: API_ENDPOINTS.auth.signin,
    method: "post",
    onSuccessMessage: "Login Successful",
    onSuccess: async (data) => {
      await tokenStorage.setTokens(
        data.data.token.tokens.accessToken,
        data.data.token.tokens.refreshToken,
      );

      router.push("/(dashboard)/(tabs)");
    },
  });

  return { login: mutate, isPending };
};
