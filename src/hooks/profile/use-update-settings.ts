import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { UserSettings } from "../../../types/auth";
import { APIResponse } from "../../../types/response";

type UpdateSettingsPayload = Partial<
  Pick<UserSettings, "theme" | "notifications">
>;

export const useUpdateSettings = function () {
  const { mutate, isPending } = useSubmitData<
    UpdateSettingsPayload,
    APIResponse<UserSettings>
  >({
    url: API_ENDPOINTS.auth.updateSettings,
    method: "patch",
    onSuccessMessage: "Preferences updated",
    additionalQueryKeys: [[API_ENDPOINTS.auth.getProfile]],
  });

  return { updateSettings: mutate, isUpdatingSettings: isPending };
};
