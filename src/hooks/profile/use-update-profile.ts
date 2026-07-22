import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { User } from "../../../types/auth";

interface UpdateProfileFields {
  first_name?: string;
  last_name?: string;
  gender?: User["gender"];
  professionId?: string;
}

export type UpdateProfilePayload = UpdateProfileFields | FormData;

interface UseUpdateProfileOptions {
  onSuccess?: (user: User) => void;
}

export const useUpdateProfile = function ({
  onSuccess,
}: UseUpdateProfileOptions = {}) {
  const { mutate, isPending } = useSubmitData<
    UpdateProfilePayload,
    APIResponse<User>
  >({
    url: API_ENDPOINTS.auth.updateProfile,
    method: "patch",
    onSuccessMessage: "Profile updated",
    additionalQueryKeys: [[API_ENDPOINTS.auth.getProfile]],
    onSuccess: (data) => onSuccess?.(data.data),
  });

  return { updateProfile: mutate, isUpdatingProfile: isPending };
};
