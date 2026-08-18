import { API_ENDPOINTS } from "@/provider/endpoints";
import { RegisterDeviceRequest } from "../../../types/notification";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useRegisterDevice = function () {
  const { mutate, isPending } = useSubmitData<
    RegisterDeviceRequest,
    APIResponse<{ id: string; deviceToken: string; deviceType: string }>
  >({
    url: API_ENDPOINTS.notifications.registerDevice,
    method: "post",
    silent: true,
  });

  return { registerDevice: mutate, isRegisteringDevice: isPending };
};
