import { SignUpFormValues } from "@/schemas/auth/sign-up";
import { useSubmitData } from "../use-submit-data";
import { User } from "../../../types/auth";
import { APIResponse } from "../../../types/response";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { router } from "expo-router";

export const useSignup = function () {
  const { mutate, isPending } = useSubmitData<
    SignUpFormValues & { deviceToken: string; deviceType: string },
    APIResponse<User>
  >({
    url: API_ENDPOINTS.auth.register,
    method: "post",
    onSuccessMessage: "Signup Successful",
    onSuccess: (data) => {
      router.push({
        pathname: "/(auth)/verify-email",
        params: { email: data.data.email },
      });
    },
  });

  return { signup: mutate, isPending };
};
