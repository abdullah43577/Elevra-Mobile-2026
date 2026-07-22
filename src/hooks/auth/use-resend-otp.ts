import { useSubmitData } from "../use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";

export const useResendOTP = function () {
  const { mutate, isPending } = useSubmitData<
    { email: string },
    APIResponse<null>
  >({
    url: API_ENDPOINTS.auth.resendVerificationOtp,
    method: "post",
    onSuccessMessage: "Verification code resent",
  });

  return { resendOtp: mutate, isResending: isPending };
};
